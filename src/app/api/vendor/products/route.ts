import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type CreateProductBody = {
  name: string;
  price: number;
  stock: number;
};

function isCreateProductBody(value: unknown): value is CreateProductBody {
  if (typeof value !== "object" || value === null) return false;

  const data = value as Record<string, unknown>;

  return (
    typeof data.name === "string" &&
    data.name.trim().length > 0 &&
    typeof data.price === "number" &&
    Number.isFinite(data.price) &&
    typeof data.stock === "number" &&
    Number.isInteger(data.stock)
  );
}

// GET - List vendor products
export async function GET(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) return error;

  const roleError = requireRole(auth, "VENDOR");
  if (roleError) return roleError;

  const store = await prisma.store.findUnique({
    where: { vendorId: auth.userId },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json(
      { message: "Store not found" },
      { status: 404 }
    );
  }

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { id: "desc" },
  });
  
  return NextResponse.json({ products });

}

// POST - Create product
export async function POST(request: NextRequest) {
  try {
    const { auth, error } = getAuthContext(request);
    if (error) return error;

    const roleError = requireRole(auth, "VENDOR");
    if (roleError) return roleError;

    const body: unknown = await request.json();
    if (!isCreateProductBody(body)) {
      return NextResponse.json(
        { message: "Invalid body. Required: name, price, stock" },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { vendorId: auth.userId },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json(
        { message: "Store not found" },
        { status: 404 }
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

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
