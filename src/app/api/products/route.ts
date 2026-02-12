import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { jsonError } from "@/app/lib/api";
import { getAuthContext, requireRole } from "@/app/lib/auth";
import { distanceKm } from "@/app/lib/geo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  const storeId = searchParams.get("storeId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radiusKm = Number(searchParams.get("radiusKm") ?? 10);

  const products = await prisma.product.findMany({
    where: {
      ...(query
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            },
          }
        : {}),
      ...(storeId ? { storeId: Number(storeId) } : {}),
      ...(minPrice ? { price: { gte: Number(minPrice) } } : {}),
      ...(maxPrice ? { price: { lte: Number(maxPrice) } } : {}),
    },
    include: {
      store: true,
    },
    orderBy: { id: "desc" },
  });

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ products });
  }

  const filteredProducts = products
    .map((product) => ({
      ...product,
      distanceKm: distanceKm(lat, lng, product.store.lat, product.store.lng),
    }))
    .filter((product) => product.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return NextResponse.json({ products: filteredProducts });
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
    const storeId = Number(body?.storeId);
    const price = Number(body?.price);
    const stock = Number(body?.stock);

    if (!name || !Number.isFinite(storeId) || !Number.isFinite(price) || !Number.isFinite(stock)) {
      return jsonError("name, storeId, price, and stock are required", 400);
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return jsonError("Store not found", 404);
    }

    if (store.vendorId !== auth.userId) {
      return jsonError("Forbidden", 403);
    }

    const product = await prisma.product.create({
      data: {
        name,
        storeId,
        price,
        stock,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return jsonError("Invalid request body", 400);
  }
}

