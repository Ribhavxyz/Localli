import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { distanceKm } from "@/lib/geo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query")?.trim();
    const storeId = searchParams.get("storeId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusKmParam = searchParams.get("radiusKm");

    const lat = latParam ? Number(latParam) : NaN;
    const lng = lngParam ? Number(lngParam) : NaN;
    const radiusKm = radiusKmParam ? Number(radiusKmParam) : 10;

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
        store: {
          select: {
            id: true,
            name: true,
            lat: true,
            lng: true,
            clusterId: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    // If no geo filtering, return raw array
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(products);
    }

    // Apply radius filtering
    const filteredProducts = products
      .map((product) => ({
        ...product,
        distanceKm: distanceKm(lat, lng, product.store.lat, product.store.lng),
      }))
      .filter((product) => product.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json(filteredProducts);
  } catch (err) {
    console.error("PUBLIC PRODUCTS ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
