import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type TopProduct = {
  id: number;
  name: string;
  totalPurchases: number;
};

type CategorySales = {
  category: string;
  revenue: number;
  unitsSold: number;
  orders: number;
};

type VendorAnalyticsResponse = {
  totalProducts: number;
  totalClicks: number;
  totalCartAdds: number;
  totalPurchases: number;
  totalRevenue: number;
  topProducts: TopProduct[];
  categorySales: CategorySales[];
};

function deriveCategory(productName: string): string {
  const value = productName.toLowerCase();
  if (value.includes("bread") || value.includes("bake")) return "Bakery";
  if (value.includes("egg") || value.includes("milk") || value.includes("cheese"))
    return "Dairy";
  if (value.includes("coffee") || value.includes("drink") || value.includes("tea"))
    return "Beverages";
  if (value.includes("fruit") || value.includes("vegetable") || value.includes("avocado"))
    return "Produce";
  return "General";
}

export async function GET(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "VENDOR");
  if (roleError) {
    return roleError;
  }

  try {
    const store = await prisma.store.findUnique({
      where: { vendorId: auth.userId },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { storeId: store.id },
      select: { id: true, name: true },
    });

    const totalProducts = products.length;
    const productIds = products.map((product) => product.id);

    if (productIds.length === 0) {
      const emptyResponse: VendorAnalyticsResponse = {
        totalProducts,
        totalClicks: 0,
        totalCartAdds: 0,
        totalPurchases: 0,
        totalRevenue: 0,
        topProducts: [],
        categorySales: [],
      };

      return NextResponse.json(emptyResponse, { status: 200 });
    }

    const [interactionCounts, purchaseCounts, orderItems] = await Promise.all([
      prisma.interactionLog.groupBy({
        by: ["action"],
        where: {
          productId: { in: productIds },
          action: {
            in: ["CLICK", "ADD_TO_CART", "PURCHASE"],
          },
        },
        _count: { _all: true },
      }),
      prisma.interactionLog.groupBy({
        by: ["productId"],
        where: {
          productId: { in: productIds },
          action: "PURCHASE",
        },
        _count: { _all: true },
      }),
      prisma.orderItem.findMany({
        where: { productId: { in: productIds } },
        select: {
          productId: true,
          price: true,
          quantity: true,
        },
      }),
    ]);

    let totalClicks = 0;
    let totalCartAdds = 0;
    let totalPurchases = 0;

    for (const row of interactionCounts) {
      if (row.action === "CLICK") {
        totalClicks = row._count._all;
      } else if (row.action === "ADD_TO_CART") {
        totalCartAdds = row._count._all;
      } else if (row.action === "PURCHASE") {
        totalPurchases = row._count._all;
      }
    }

    const totalRevenue = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const productNameById = new Map<number, string>(
      products.map((product) => [product.id, product.name])
    );

    const topProducts: TopProduct[] = purchaseCounts
      .map((row) => ({
        id: row.productId,
        name: productNameById.get(row.productId) ?? "Unknown Product",
        totalPurchases: row._count._all,
      }))
      .sort((a, b) => b.totalPurchases - a.totalPurchases);

    const response: VendorAnalyticsResponse = {
      totalProducts,
      totalClicks,
      totalCartAdds,
      totalPurchases,
      totalRevenue,
      topProducts,
      categorySales: buildCategorySales(orderItems, productNameById),
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch vendor analytics" },
      { status: 500 }
    );
  }
}

function buildCategorySales(
  orderItems: Array<{ productId: number; price: number; quantity: number }>,
  productNameById: Map<number, string>
): CategorySales[] {
  const categoryMap = new Map<string, CategorySales>();

  for (const item of orderItems) {
    const productName = productNameById.get(item.productId) ?? "";
    const category = deriveCategory(productName);
    const current = categoryMap.get(category) ?? {
      category,
      revenue: 0,
      unitsSold: 0,
      orders: 0,
    };

    current.revenue += item.price * item.quantity;
    current.unitsSold += item.quantity;
    current.orders += 1;
    categoryMap.set(category, current);
  }

  return Array.from(categoryMap.values())
    .map((entry) => ({
      ...entry,
      revenue: Number(entry.revenue.toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue);
}
