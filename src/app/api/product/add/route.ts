import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@src/lib/prisma";
import { AuthError, verifyAuth } from "@/lib/auth";

type AddProductBody = {
  name: string;
  price: number;
  stock: number;
};

function isAddProductBody(value: unknown): value is AddProductBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return false;
  }

  if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price <= 0) {
    return false;
  }

  if (
    typeof body.stock !== "number" ||
    !Number.isFinite(body.stock) ||
    body.stock < 0
  ) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);

    if (auth.role !== "VENDOR") {
      return NextResponse.json(
        { message: "Only vendors can add products" },
        { status: 403 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { vendorId: auth.userId },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json(
        { message: "Vendor store not found" },
        { status: 404 }
      );
    }

    const body: unknown = await request.json();
    if (!isAddProductBody(body)) {
      return NextResponse.json(
        {
          message:
            "Invalid body. Required: name (non-empty string), price (number > 0), stock (number >= 0)",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        price: body.price,
        stock: body.stock,
        storeId: store.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

