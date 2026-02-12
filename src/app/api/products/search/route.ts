import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { distanceKm } from "@/lib/geo";

type ProductSearchResult = {
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    storeId: number;
  };
  store: {
    id: number;
    name: string;
    lat: number;
    lng: number;
  };
  distanceKm: number | null;
};

function parseOptionalNumber(value: string | null): number | null {
  if (value === null || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid number parameter");
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const lat = parseOptionalNumber(searchParams.get("lat"));
    const lng = parseOptionalNumber(searchParams.get("lng"));
    const radius = parseOptionalNumber(searchParams.get("radius"));

    const hasLat = lat !== null;
    const hasLng = lng !== null;
    const hasRadius = radius !== null;

    if (hasLat !== hasLng) {
      return NextResponse.json(
        { message: "Both lat and lng must be provided together" },
        { status: 400 }
      );
    }

    if (hasRadius && !hasLat) {
      return NextResponse.json(
        { message: "lat and lng are required when radius is provided" },
        { status: 400 }
      );
    }

    if (hasRadius && radius <= 0) {
      return NextResponse.json(
        { message: "radius must be greater than 0" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: q
        ? {
            name: {
              contains: q,
              mode: "insensitive",
            },
          }
        : undefined,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        storeId: true,
        store: {
          select: {
            id: true,
            name: true,
            lat: true,
            lng: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    const results: ProductSearchResult[] = products
      .map((item) => {
        const computedDistance =
          hasLat && hasLng ? distanceKm(lat, lng, item.store.lat, item.store.lng) : null;

        return {
          product: {
            id: item.id,
            name: item.name,
            price: item.price,
            stock: item.stock,
            storeId: item.storeId,
          },
          store: {
            id: item.store.id,
            name: item.store.name,
            lat: item.store.lat,
            lng: item.store.lng,
          },
          distanceKm: computedDistance,
        };
      })
      .filter((item) => {
        if (!hasRadius) {
          return true;
        }

        return item.distanceKm !== null && item.distanceKm <= radius;
      });

    return NextResponse.json(results, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Invalid number parameter") {
      return NextResponse.json(
        { message: "lat, lng, and radius must be valid numbers when provided" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

