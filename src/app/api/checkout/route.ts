import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

const INSUFFICIENT_STOCK_ERROR = "INSUFFICIENT_STOCK";

type CheckoutResponse = {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: Date;
  orderItems: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
  }>;
};

export async function POST(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "CUSTOMER");
  if (roleError) {
    return roleError;
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: auth.userId },
      select: {
        id: true,
        productId: true,
        quantity: true,
        product: {
          select: {
            id: true,
            price: true,
            stock: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const stockIssue = cartItems.find((item) => item.quantity > item.product.stock);
    if (stockIssue) {
      return NextResponse.json(
        { message: `Insufficient stock for product ${stockIssue.product.id}` },
        { status: 409 }
      );
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const order = await prisma.$transaction(async (tx): Promise<CheckoutResponse> => {
      const createdOrder = await tx.order.create({
        data: {
          userId: auth.userId,
          total,
          status: "PLACED",
        },
      });

      const orderItems: CheckoutResponse["orderItems"] = [];

      for (const item of cartItems) {
        const stockUpdate = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (stockUpdate.count === 0) {
          throw new Error(INSUFFICIENT_STOCK_ERROR);
        }

        const orderItem = await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        orderItems.push(orderItem);
      }

      await tx.cartItem.deleteMany({
        where: { userId: auth.userId },
      });

      return {
        id: createdOrder.id,
        userId: createdOrder.userId,
        total: createdOrder.total,
        status: createdOrder.status,
        createdAt: createdOrder.createdAt,
        orderItems,
      };
    });

    return NextResponse.json(order, { status: 201 });
  } catch (checkoutError: unknown) {
    if (
      checkoutError instanceof Error &&
      checkoutError.message === INSUFFICIENT_STOCK_ERROR
    ) {
      return NextResponse.json(
        { message: "Insufficient stock for one or more products" },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Checkout failed" }, { status: 500 });
  }
}
