import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { auth, error } = getAuthContext(request);
  if (error) return error;

  const roleError = requireRole(auth, "VENDOR");
  if (roleError) return roleError;

  // 🔥 Correct for Next 16
  const { id: rawId } = await params;
  const productId = Number(rawId);

  if (!Number.isInteger(productId)) {
    return NextResponse.json(
      { message: "Invalid product id" },
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

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId: store.id,
    },
  });

  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}
