import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthContext, requireRole } from "@/app/lib/auth";
import { jsonError } from "@/app/lib/api";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const storeId = Number(id);
  if (!Number.isInteger(storeId)) {
    return jsonError("Invalid store id", 400);
  }

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      vendor: { select: { id: true, name: true, email: true } },
      products: true,
    },
  });

  if (!store) {
    return jsonError("Store not found", 404);
  }

  return NextResponse.json({ store });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const storeId = Number(id);
  if (!Number.isInteger(storeId)) {
    return jsonError("Invalid store id", 400);
  }

  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "VENDOR");
  if (roleError) {
    return roleError;
  }

  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    return jsonError("Store not found", 404);
  }

  if (store.vendorId !== auth.userId) {
    return jsonError("Forbidden", 403);
  }

  try {
    const body = await request.json();
    const name = body?.name ? String(body.name).trim() : undefined;
    const description = body?.description ? String(body.description).trim() : undefined;
    const lat = body?.lat !== undefined ? Number(body.lat) : undefined;
    const lng = body?.lng !== undefined ? Number(body.lng) : undefined;

    if (lat !== undefined && !Number.isFinite(lat)) {
      return jsonError("Invalid lat", 400);
    }

    if (lng !== undefined && !Number.isFinite(lng)) {
      return jsonError("Invalid lng", 400);
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        description,
        lat,
        lng,
      },
    });

    return NextResponse.json({ store: updatedStore });
  } catch {
    return jsonError("Invalid request body", 400);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const storeId = Number(id);
  if (!Number.isInteger(storeId)) {
    return jsonError("Invalid store id", 400);
  }

  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "VENDOR");
  if (roleError) {
    return roleError;
  }

  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    return jsonError("Store not found", 404);
  }

  if (store.vendorId !== auth.userId) {
    return jsonError("Forbidden", 403);
  }

  await prisma.store.delete({ where: { id: storeId } });
  return NextResponse.json({ success: true });
}

