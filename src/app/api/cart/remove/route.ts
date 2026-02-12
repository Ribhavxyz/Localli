import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type RemoveCartBody = {
  productId: number;
};

function isRemoveCartBody(value: unknown): value is RemoveCartBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;
  return typeof body.productId === "number" && Number.isInteger(body.productId);
}

export async function DELETE(request: NextRequest) {
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
    if (!isRemoveCartBody(body)) {
      return NextResponse.json(
        { message: "Invalid body. Required: { productId: number }" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId: auth.userId,
        productId: body.productId,
      },
      select: { id: true },
    });

    if (!cartItem) {
      return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({ message: "Cart item removed successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
}

