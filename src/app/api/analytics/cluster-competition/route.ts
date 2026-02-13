import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ClusterCompetitionResult = {
  clusterId: string;
  totalVendors: number;
  totalProducts: number;
  demandScore: number;
  competitionIndex: number;
  opportunityScore: number;
};

type ClusterAccumulator = {
  vendorIds: Set<number>;
  totalProducts: number;
  totalPurchases: number;
  totalCartAdds: number;
  totalRevenue: number;
};

function getOrCreateClusterAccumulator(
  clusterMap: Map<string, ClusterAccumulator>,
  clusterId: string
): ClusterAccumulator {
  const existing = clusterMap.get(clusterId);
  if (existing) {
    return existing;
  }

  const created: ClusterAccumulator = {
    vendorIds: new Set<number>(),
    totalProducts: 0,
    totalPurchases: 0,
    totalCartAdds: 0,
    totalRevenue: 0,
  };
  clusterMap.set(clusterId, created);
  return created;
}

export async function GET() {
  try {
    const [stores, products, interactions, orderItems] = await Promise.all([
      prisma.store.findMany({
        select: {
          id: true,
          clusterId: true,
          vendorId: true,
        },
      }),
      prisma.product.findMany({
        select: {
          id: true,
          storeId: true,
        },
      }),
      prisma.interactionLog.findMany({
        where: {
          action: {
            in: ["PURCHASE", "ADD_TO_CART"],
          },
        },
        select: {
          action: true,
          product: {
            select: {
              store: {
                select: {
                  clusterId: true,
                },
              },
            },
          },
        },
      }),
      prisma.orderItem.findMany({
        select: {
          price: true,
          quantity: true,
          product: {
            select: {
              store: {
                select: {
                  clusterId: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const clusterMap = new Map<string, ClusterAccumulator>();

    const storeClusterById = new Map<number, string>();
    for (const store of stores) {
      storeClusterById.set(store.id, store.clusterId);
      const acc = getOrCreateClusterAccumulator(clusterMap, store.clusterId);
      acc.vendorIds.add(store.vendorId);
    }

    for (const product of products) {
      const clusterId = storeClusterById.get(product.storeId);
      if (!clusterId) {
        continue;
      }

      const acc = getOrCreateClusterAccumulator(clusterMap, clusterId);
      acc.totalProducts += 1;
    }

    for (const interaction of interactions) {
      const clusterId = interaction.product.store.clusterId;
      const acc = getOrCreateClusterAccumulator(clusterMap, clusterId);

      if (interaction.action === "PURCHASE") {
        acc.totalPurchases += 1;
      } else if (interaction.action === "ADD_TO_CART") {
        acc.totalCartAdds += 1;
      }
    }

    for (const orderItem of orderItems) {
      const clusterId = orderItem.product.store.clusterId;
      const acc = getOrCreateClusterAccumulator(clusterMap, clusterId);
      acc.totalRevenue += orderItem.price * orderItem.quantity;
    }

    const clusters: ClusterCompetitionResult[] = Array.from(clusterMap.entries())
      .map(([clusterId, acc]) => {
        const totalVendors = acc.vendorIds.size;
        const demandScore =
          acc.totalPurchases * 5 + acc.totalCartAdds * 2 + acc.totalRevenue * 0.1;
        const competitionIndex = totalVendors * 2 + acc.totalProducts;
        const opportunityScore = demandScore / (competitionIndex + 1);

        return {
          clusterId,
          totalVendors,
          totalProducts: acc.totalProducts,
          demandScore,
          competitionIndex,
          opportunityScore,
        };
      })
      .sort((a, b) => b.opportunityScore - a.opportunityScore);

    return NextResponse.json({ clusters }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to compute cluster competition analytics" },
      { status: 500 }
    );
  }
}

