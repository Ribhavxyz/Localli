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

