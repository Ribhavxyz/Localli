import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type RouteParams = {
  params: { id: string };
};

type UpdateBody = {
  quantity: number;
};

function isUpdateBody(value: unknown): value is UpdateBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;
  return typeof body.quantity === "number" && Number.isInteger(body.quantity);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "CUSTOMER");
  if (roleError) {
    return roleError;
  }

  const rawId = params.id;
  const cartItemId = Number(rawId);
  if (!Number.isInteger(cartItemId)) {
    return NextResponse.json({ message: "Invalid cart item id" }, { status: 400 });
  }

  try {
    const body: unknown = await request.json();
    if (!isUpdateBody(body)) {
      return NextResponse.json(
        { message: "Invalid body. Required: { quantity: number }" },
        { status: 400 }
      );
    }

    if (body.quantity <= 0) {
      return NextResponse.json(
        { message: "quantity must be greater than 0" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: {
        id: true,
        userId: true,
        productId: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    }
    if (cartItem.userId !== auth.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const product = await prisma.product.findUnique({
      where: { id: cartItem.productId },
      select: { stock: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (body.quantity > product.stock) {
      return NextResponse.json(
        { message: "Requested quantity exceeds available stock" },
        { status: 409 }
      );
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: body.quantity },
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "CUSTOMER");
  if (roleError) {
    return roleError;
  }

  const rawId = params.id;
  const cartItemId = Number(rawId);
  if (!Number.isInteger(cartItemId)) {
    return NextResponse.json({ message: "Invalid cart item id" }, { status: 400 });
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { id: true, userId: true },
    });

    if (!cartItem) {
      return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    }
    if (cartItem.userId !== auth.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({ message: "Cart item removed successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Failed to remove cart item" }, { status: 500 });
  }
}
