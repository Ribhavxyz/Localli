import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";


type CreateStoreBody = {
  name: string;
  description?: string;
  lat: number;
  lng: number;
};

function isCreateStoreBody(value: unknown): value is CreateStoreBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  if (typeof data.name !== "string" || data.name.trim().length === 0) {
    return false;
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    return false;
  }

  if (typeof data.lat !== "number" || !Number.isFinite(data.lat)) {
    return false;
  }

  if (typeof data.lng !== "number" || !Number.isFinite(data.lng)) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Get auth context
    const { auth, error } = getAuthContext(request);
    if (error) return error;

    // 2️⃣ Require vendor role
    const roleError = requireRole(auth, "VENDOR");
    if (roleError) return roleError;

    // 3️⃣ Validate body
    const body: unknown = await request.json();
    if (!isCreateStoreBody(body)) {
      return NextResponse.json(
        {
          message:
            "Invalid body. Required: name (string), lat (number), lng (number), optional description (string)",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Check if store already exists
    const existingStore = await prisma.store.findUnique({
      where: { vendorId: auth.userId },
      select: { id: true },
    });

    if (existingStore) {
      return NextResponse.json(
        { message: "Vendor already has a store" },
        { status: 409 }
      );
    }

    // 5️⃣ Create store
    const createdStore = await prisma.store.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        lat: body.lat,
        lng: body.lng,
        vendorId: auth.userId,
      },
    });

    return NextResponse.json(createdStore, { status: 201 });

  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


