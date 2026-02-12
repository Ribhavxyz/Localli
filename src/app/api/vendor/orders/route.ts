import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type VendorOrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
};

type VendorOrder = {
  id: number;
  total: number;
  status: string;
  createdAt: Date;
  orderItems: VendorOrderItem[];
};

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
    const orders: VendorOrder[] = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              store: {
                vendorId: auth.userId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        orderItems: {
          where: {
            product: {
              store: {
                vendorId: auth.userId,
              },
            },
          },
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch vendor orders" },
      { status: 500 }
    );
  }
}

