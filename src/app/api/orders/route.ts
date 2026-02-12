import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type OrderListItem = {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: Date;
  orderItems: Array<{
    id: number;
    productId: number;
    quantity: number;
    price: number;
  }>;
};

export async function GET(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "CUSTOMER");
  if (roleError) {
    return roleError;
  }

  try {
    const orders: OrderListItem[] = await prisma.order.findMany({
      where: { userId: auth.userId },
      select: {
        id: true,
        userId: true,
        total: true,
        status: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

