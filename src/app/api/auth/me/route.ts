import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthContext } from "@/app/lib/auth";
import { jsonError } from "@/app/lib/api";

export async function GET(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return jsonError("User not found", 404);
  }

  return NextResponse.json({ user });
}

