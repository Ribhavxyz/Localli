import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jsonError } from "@/app/lib/api";

type AuthPayload = {
  userId: number;
  role: Role;
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & Partial<AuthPayload>;
    if (
      typeof decoded.userId !== "number" ||
      (decoded.role !== "CUSTOMER" && decoded.role !== "VENDOR")
    ) {
      return null;
    }

    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function getAuthContext(
  request: NextRequest
): { auth: AuthPayload; error: null } | { auth: null; error: NextResponse } {
  const header = request.headers.get("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return { auth: null, error: jsonError("Unauthorized", 401) };
  }

  const token = header.slice("Bearer ".length).trim();
  const auth = verifyToken(token);

  if (!auth) {
    return { auth: null, error: jsonError("Invalid token", 401) };
  }

  return { auth, error: null };
}

export function requireRole(auth: AuthPayload, role: Role): NextResponse | null {
  if (auth.role !== role) {
    return jsonError("Forbidden", 403);
  }

  return null;
}

export type { AuthPayload };

