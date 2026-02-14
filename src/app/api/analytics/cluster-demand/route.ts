import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ClusterMetrics = {
  clusterId: string;
  currentDemandScore: number;
  previousDemandScore: number;
  growthRate: number;
  isSurging: boolean;
  latitude: number;
  longitude: number;
};

type ClusterAccumulator = {
  totalPurchases: number;
  totalCartAdds: number;
  totalRevenue: number;
};

type GeoAccumulator = {
  latSum: number;
  lngSum: number;
  count: number;
};

function computeDemandScore(values: ClusterAccumulator): number {
  return values.totalPurchases * 5 + values.totalCartAdds * 2 + values.totalRevenue * 0.1;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");

    if (daysParam === null || daysParam.trim() === "") {
      return NextResponse.json(
        { message: "days query parameter is required" },
        { status: 400 }
      );
    }

    const days = Number(daysParam);
    if (!Number.isFinite(days) || days <= 0) {
      return NextResponse.json(
        { message: "days must be a positive number" },
        { status: 400 }
      );
    }

    const now = new Date();
    const currentStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const previousStart = new Date(now.getTime() - 2 * days * 24 * 60 * 60 * 1000);

    const [currentInteractions, previousInteractions, currentOrderItems, previousOrderItems] =
      await Promise.all([
        prisma.interactionLog.findMany({
          where: {
            action: {
              in: ["PURCHASE", "ADD_TO_CART"],
            },
            createdAt: {
              gte: currentStart,
              lte: now,
            },
          },
          select: {
            action: true,
            product: {
              select: {
                store: {
                  select: {
                    clusterId: true,
                    lat: true,
                    lng: true,
                  },
                },
              },
            },
          },
        }),
        prisma.interactionLog.findMany({
          where: {
            action: {
              in: ["PURCHASE", "ADD_TO_CART"],
            },
            createdAt: {
              gte: previousStart,
              lt: currentStart,
            },
          },
          select: {
            action: true,
            product: {
              select: {
                store: {
                  select: {
                    clusterId: true,
                    lat: true,
                    lng: true,
                  },
                },
              },
            },
          },
        }),
        prisma.orderItem.findMany({
          where: {
            order: {
              createdAt: {
                gte: currentStart,
                lte: now,
              },
            },
          },
          select: {
            price: true,
            quantity: true,
            product: {
              select: {
                store: {
                  select: {
                    clusterId: true,
                    lat: true,
                    lng: true,
                  },
                },
              },
            },
          },
        }),
        prisma.orderItem.findMany({
          where: {
            order: {
              createdAt: {
                gte: previousStart,
                lt: currentStart,
              },
            },
          },
          select: {
            price: true,
            quantity: true,
            product: {
              select: {
                store: {
                  select: {
                    clusterId: true,
                    lat: true,
                    lng: true,
                  },
                },
              },
            },
          },
        }),
      ]);

    const currentClusterMap = new Map<string, ClusterAccumulator>();
    const previousClusterMap = new Map<string, ClusterAccumulator>();
    const clusterGeoMap = new Map<string, GeoAccumulator>();

    for (const interaction of currentInteractions) {
      const clusterId = interaction.product.store.clusterId;
      const lat = interaction.product.store.lat;
      const lng = interaction.product.store.lng;
      const values = currentClusterMap.get(clusterId) ?? {
        totalPurchases: 0,
        totalCartAdds: 0,
        totalRevenue: 0,
      };

      if (interaction.action === "PURCHASE") {
        values.totalPurchases += 1;
      } else if (interaction.action === "ADD_TO_CART") {
        values.totalCartAdds += 1;
      }

      currentClusterMap.set(clusterId, values);

      const geo = clusterGeoMap.get(clusterId) ?? {
        latSum: 0,
        lngSum: 0,
        count: 0,
      };

      geo.latSum += lat ?? 0;
      geo.lngSum += lng ?? 0;
      geo.count += 1;
      clusterGeoMap.set(clusterId, geo);
    }

    for (const orderItem of currentOrderItems) {
      const clusterId = orderItem.product.store.clusterId;
      const lat = orderItem.product.store.lat;
      const lng = orderItem.product.store.lng;
      const values = currentClusterMap.get(clusterId) ?? {
        totalPurchases: 0,
        totalCartAdds: 0,
        totalRevenue: 0,
      };

      values.totalRevenue += orderItem.price * orderItem.quantity;
      currentClusterMap.set(clusterId, values);

      const geo = clusterGeoMap.get(clusterId) ?? {
        latSum: 0,
        lngSum: 0,
        count: 0,
      };

      geo.latSum += lat ?? 0;
      geo.lngSum += lng ?? 0;
      geo.count += 1;
      clusterGeoMap.set(clusterId, geo);
    }

    for (const interaction of previousInteractions) {
      const clusterId = interaction.product.store.clusterId;
      const values = previousClusterMap.get(clusterId) ?? {
        totalPurchases: 0,
        totalCartAdds: 0,
        totalRevenue: 0,
      };

      if (interaction.action === "PURCHASE") {
        values.totalPurchases += 1;
      } else if (interaction.action === "ADD_TO_CART") {
        values.totalCartAdds += 1;
      }

      previousClusterMap.set(clusterId, values);
    }

    for (const orderItem of previousOrderItems) {
      const clusterId = orderItem.product.store.clusterId;
      const values = previousClusterMap.get(clusterId) ?? {
        totalPurchases: 0,
        totalCartAdds: 0,
        totalRevenue: 0,
      };

      values.totalRevenue += orderItem.price * orderItem.quantity;
      previousClusterMap.set(clusterId, values);
    }

    const allClusterIds = new Set<string>([
      ...Array.from(currentClusterMap.keys()),
      ...Array.from(previousClusterMap.keys()),
    ]);

    const clusters: ClusterMetrics[] = Array.from(allClusterIds)
      .map((clusterId) => {
        const currentValues = currentClusterMap.get(clusterId) ?? {
          totalPurchases: 0,
          totalCartAdds: 0,
          totalRevenue: 0,
        };
        const previousValues = previousClusterMap.get(clusterId) ?? {
          totalPurchases: 0,
          totalCartAdds: 0,
          totalRevenue: 0,
        };

        const currentDemandScore = computeDemandScore(currentValues);
        const previousDemandScore = computeDemandScore(previousValues);

        let growthRate = 0;
        if (previousDemandScore > 0) {
          growthRate = ((currentDemandScore - previousDemandScore) / previousDemandScore) * 100;
        } else if (currentDemandScore > 0) {
          growthRate = 100;
        }

        const isSurging = growthRate >= 50 && currentDemandScore >= 20;
        const geo = clusterGeoMap.get(clusterId);
        const latitude = geo && geo.count > 0 ? geo.latSum / geo.count : 0;
        const longitude = geo && geo.count > 0 ? geo.lngSum / geo.count : 0;

        return {
          clusterId,
          currentDemandScore,
          previousDemandScore,
          growthRate,
          isSurging,
          latitude,
          longitude,
        };
      })
      .sort((a, b) => {
        if (a.isSurging !== b.isSurging) {
          return a.isSurging ? -1 : 1;
        }

        return b.growthRate - a.growthRate;
      });

    return NextResponse.json({ clusters }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to compute cluster demand analytics" },
      { status: 500 }
    );
  }
}
