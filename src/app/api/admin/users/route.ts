import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAuthContext, requireRole } from "@/lib/auth";

type CreateUserBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
};

export async function POST(request: NextRequest) {
  const { auth, error } = getAuthContext(request);
  if (error) {
    return error;
  }

  const roleError = requireRole(auth, "ADMIN");
  if (roleError) {
    return roleError;
  }

  try {
    const body = (await request.json()) as CreateUserBody;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = body.role;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "name, email, password and role are required" },
        { status: 400 }
      );
    }

    if (role !== "CUSTOMER" && role !== "VENDOR" && role !== "ADMIN") {
      return NextResponse.json(
        { message: "role must be CUSTOMER, VENDOR, or ADMIN" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
  }
}
