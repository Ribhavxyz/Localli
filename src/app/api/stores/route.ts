import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { jsonError } from "@/app/lib/api";
import { distanceKm } from "@/app/lib/geo";
import { getAuthContext, requireRole } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radiusKm = Number(searchParams.get("radiusKm") ?? 10);

  const stores = await prisma.store.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      vendor: { select: { id: true, name: true, email: true } },
      _count: { select: { products: true } },
    },
    orderBy: { id: "desc" },
  });

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ stores });
  }

  const filteredStores = stores
    .map((store) => {
      const distance = distanceKm(lat, lng, store.lat, store.lng);
      return { ...store, distanceKm: distance };
    })
    .filter((store) => store.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return NextResponse.json({ stores: filteredStores });
}

export async function POST(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "VENDOR");
  if (roleError) {
    return roleError;
  }

  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const description = body?.description ? String(body.description).trim() : null;
    const lat = Number(body?.lat);
    const lng = Number(body?.lng);

    if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return jsonError("name, lat, and lng are required", 400);
    }

    const existingStore = await prisma.store.findUnique({
      where: { vendorId: auth.userId },
    });
    if (existingStore) {
      return jsonError("Vendor already has a store", 409);
    }

    const store = await prisma.store.create({
      data: {
        name,
        description,
        lat,
        lng,
        vendorId: auth.userId,
      },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch {
    return jsonError("Invalid request body", 400);
  }
}

