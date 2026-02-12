import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type SignupBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: "CUSTOMER" | "VENDOR";
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupBody;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "name, email, password, and role are required" },
        { status: 400 }
      );
    }

    if (role !== "CUSTOMER" && role !== "VENDOR") {
      return NextResponse.json(
        { message: "role must be CUSTOMER or VENDOR" },
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
      },
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
}

