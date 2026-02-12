import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { jsonError } from "@/app/lib/api";
import { signToken } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    const role = body?.role;

    if (!name || !email || !password) {
      return jsonError("Name, email, and password are required", 400);
    }

    if (!["CUSTOMER", "VENDOR"].includes(role)) {
      return jsonError("Role must be CUSTOMER or VENDOR", 400);
    }

    if (password.length < 6) {
      return jsonError("Password must be at least 6 characters", 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return jsonError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const token = signToken({ userId: user.id, role: user.role });
    return NextResponse.json({ user, token }, { status: 201 });
  } catch {
    return jsonError("Invalid request body", 400);
  }
}

