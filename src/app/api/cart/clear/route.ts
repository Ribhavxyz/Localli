import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "CUSTOMER");
  if (roleError) {
    return roleError;
  }

  try {
    await prisma.cartItem.deleteMany({
      where: { userId: auth.userId },
    });

    return NextResponse.json({ message: "Cart cleared" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Failed to clear cart" }, { status: 500 });
  }
}

