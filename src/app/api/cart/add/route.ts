import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type AddCartBody = {
  productId: number;
  quantity: number;
};

function isAddCartBody(value: unknown): value is AddCartBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  if (!("productId" in body) || !("quantity" in body)) {
    return false;
  }

  if (typeof body.productId !== "number" || !Number.isInteger(body.productId)) {
    return false;
  }

  if (typeof body.quantity !== "number" || !Number.isInteger(body.quantity) || body.quantity <= 0) {
    return false;
  }

  return true;
}

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
    const body: unknown = await request.json();
    if (!isAddCartBody(body)) {
      return NextResponse.json(
        { message: "Invalid body. Required: { productId: number, quantity: integer > 0 }" },
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
    });

    if (existingCartItem) {
      const updatedQuantity = Math.min(existingCartItem.quantity + body.quantity, product.stock);

      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: updatedQuantity },
      });

      return NextResponse.json(updatedCartItem, { status: 200 });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: auth.userId,
        productId: body.productId,
        quantity: body.quantity,
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
}

