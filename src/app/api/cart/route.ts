import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type CartItemWithProduct = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    storeId: number;
  };
};

export async function GET(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "CUSTOMER");
  if (roleError) {
    return roleError;
  }

  try {
    const cartItems: CartItemWithProduct[] = await prisma.cartItem.findMany({
      where: { userId: auth.userId },
      select: {
        id: true,
        userId: true,
        productId: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            storeId: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(cartItems, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) return error;

  const roleError = requireRole(auth, "CUSTOMER");
  if (roleError) return roleError;

  try {
    const body = await request.json();
    const productId = Number(body?.productId);
    const quantity = Number(body?.quantity);

    if (!Number.isFinite(productId) || !Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json(
        { message: "Invalid productId or quantity" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: auth.userId,
          productId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: auth.userId,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json(
      { message: "Added to cart", cartItem },
      { status: 201 }
    );
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

