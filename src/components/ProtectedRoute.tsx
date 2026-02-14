"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { loading, token, userRole } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      router.replace("/");
    }
  }, [loading, requiredRole, router, token, userRole]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-zinc-300">
        Loading...
      </div>
    );
  }

  if (!token || (requiredRole && userRole !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
