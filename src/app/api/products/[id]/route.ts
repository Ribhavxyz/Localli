import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { jsonError } from "@/app/lib/api";
import { getAuthContext, requireRole } from "@/app/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return jsonError("Invalid product id", 400);
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { store: true },
  });

  if (!product) {
    return jsonError("Product not found", 404);
  }

  return NextResponse.json({ product });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return jsonError("Invalid product id", 400);
  }

  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "VENDOR");
  if (roleError) {
    return roleError;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { store: true },
  });
  if (!product) {
    return jsonError("Product not found", 404);
  }

  if (product.store.vendorId !== auth.userId) {
    return jsonError("Forbidden", 403);
  }

  try {
    const body = await request.json();
    const name = body?.name ? String(body.name).trim() : undefined;
    const price = body?.price !== undefined ? Number(body.price) : undefined;
    const stock = body?.stock !== undefined ? Number(body.stock) : undefined;

    if (price !== undefined && !Number.isFinite(price)) {
      return jsonError("Invalid price", 400);
    }

    if (stock !== undefined && !Number.isFinite(stock)) {
      return jsonError("Invalid stock", 400);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        stock,
      },
    });

    return NextResponse.json({ product: updatedProduct });
  } catch {
    return jsonError("Invalid request body", 400);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return jsonError("Invalid product id", 400);
  }

  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "VENDOR");
  if (roleError) {
    return roleError;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { store: true },
  });
  if (!product) {
    return jsonError("Product not found", 404);
  }

  if (product.store.vendorId !== auth.userId) {
    return jsonError("Forbidden", 403);
  }

  await prisma.product.delete({ where: { id: productId } });
  return NextResponse.json({ success: true });
}

