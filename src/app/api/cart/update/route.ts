import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type UpdateCartBody = {
  productId: number;
  quantity: number;
};

function isUpdateCartBody(value: unknown): value is UpdateCartBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  if (typeof body.productId !== "number" || !Number.isInteger(body.productId)) {
    return false;
  }

  if (typeof body.quantity !== "number" || !Number.isInteger(body.quantity)) {
    return false;
  }

  return true;
}

export async function PATCH(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "CUSTOMER");
  if (roleError) {
    return roleError;
  }

  try {
    const body: unknown = await request.json();
    if (!isUpdateCartBody(body)) {
      return NextResponse.json(
        { message: "Invalid body. Required: { productId: number, quantity: number }" },
        { status: 400 }
      );
    }

    if (body.quantity <= 0) {
      return NextResponse.json(
        { message: "quantity must be greater than 0" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: body.productId },
      select: { id: true, stock: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.stock < body.quantity) {
      return NextResponse.json(
        { message: "Requested quantity exceeds available stock" },
        { status: 409 }
      );
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: auth.userId,
        productId: body.productId,
      },
      select: {
        id: true,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: body.quantity },
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
}

