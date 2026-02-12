import jwt, { JwtPayload } from "jsonwebtoken";

export class AuthError extends Error {
  readonly status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export interface AuthPayload extends JwtPayload {
  userId: number;
  email?: string;
  role?: "CUSTOMER" | "VENDOR";
}

function extractBearerToken(authorizationHeader: string | null): string {
  if (!authorizationHeader) {
    throw new AuthError("Authorization header is required");
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new AuthError("Missing or malformed Bearer token");
  }

  return token;
}

function parseVerifiedPayload(decoded: string | JwtPayload): AuthPayload {
  if (typeof decoded === "string") {
    throw new AuthError("Invalid token payload");
  }

  if (typeof decoded.userId !== "number") {
    throw new AuthError("Invalid token payload");
  }

  const basePayload: AuthPayload = {
    ...decoded,
    userId: decoded.userId,
  };

  if (
    basePayload.role !== undefined &&
    basePayload.role !== "CUSTOMER" &&
    basePayload.role !== "VENDOR"
  ) {
    throw new AuthError("Invalid token payload");
  }

  return basePayload;
}

export function verifyAuth(req: Request): AuthPayload {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AuthError("JWT_SECRET is not configured", 500);
  }

  const token = extractBearerToken(req.headers.get("authorization"));

  try {
    const decoded = jwt.verify(token, jwtSecret);
    return parseVerifiedPayload(decoded);
  } catch {
    throw new AuthError("Invalid or expired token");
  }
}

