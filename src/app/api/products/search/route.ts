import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { distanceKm } from "@/lib/geo";
import { calculateClusterId } from "@/utils/cluster";

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
  engagementScore: number;
  finalScore?: number;
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
    const q = searchParams.get("query")?.trim() ?? searchParams.get("q")?.trim();
    const lat = parseOptionalNumber(searchParams.get("lat"));
    const lng = parseOptionalNumber(searchParams.get("lng"));
    const radius = parseOptionalNumber(searchParams.get("radius"));

    const hasLat = lat !== null;
    const hasLng = lng !== null;
    const hasRadius = radius !== null;
    const requestedClusterId = hasLat && hasLng ? calculateClusterId(lat, lng) : null;

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
      where: {
        ...(q
          ? {
            name: {
              contains: q,
              mode: "insensitive",
            },
          }
          : {}),
        ...(requestedClusterId
          ? {
              store: {
                clusterId: requestedClusterId,
              },
            }
          : {}),
      },
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

    const baseResults = products
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
          distanceKm: computedDistance as number | null,
        };
      })
      .filter((item) => {
        if (!hasRadius) {
          return true;
        }

        return item.distanceKm !== null && item.distanceKm <= radius;
      });

    const productIds = baseResults.map((item) => item.product.id);
    if (productIds.length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const interactionRows = await prisma.interactionLog.groupBy({
      by: ["productId", "action"],
      where: {
        productId: {
          in: productIds,
        },
      },
      _count: {
        _all: true,
      },
    });

    const scoreByProductId = new Map<number, number>();
    for (const row of interactionRows) {
      const current = scoreByProductId.get(row.productId) ?? 0;
      let weight = 0;

      if (row.action === "CLICK") {
        weight = 1;
      } else if (row.action === "ADD_TO_CART") {
        weight = 3;
      } else if (row.action === "PURCHASE") {
        weight = 5;
      }

      scoreByProductId.set(row.productId, current + row._count._all * weight);
    }

    const rankedProducts: ProductSearchResult[] = baseResults
      .map((item) => {
        const engagementScore = scoreByProductId.get(item.product.id) ?? 0;

        if (hasLat && hasLng && item.distanceKm !== null) {
          const distanceBoost = 1 / (1 + item.distanceKm);
          const finalScore = engagementScore * 5 + distanceBoost * 10;
          return {
            ...item,
            engagementScore,
            finalScore,
          };
        }

        return {
          ...item,
          engagementScore,
        };
      })
      .sort((a, b) => {
        if (hasLat && hasLng) {
          return (b.finalScore ?? -Infinity) - (a.finalScore ?? -Infinity);
        }

        return b.engagementScore - a.engagementScore;
      });

    return NextResponse.json({ products: rankedProducts }, { status: 200 });
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
