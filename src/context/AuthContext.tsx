"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

type AuthContextValue = {
  userRole: UserRole | null;
  token: string | null;
  loading: boolean;
  login: (nextToken: string, nextRole: UserRole) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";

export function AuthProvider({ children }: AuthProviderProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedRole = localStorage.getItem(ROLE_KEY);

      const validRole =
        storedRole === "CUSTOMER" || storedRole === "VENDOR" || storedRole === "ADMIN"
          ? storedRole
          : null;

      setToken(storedToken);
      setUserRole(validRole);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      userRole,
      token,
      loading,
      login: (nextToken, nextRole) => {
        localStorage.setItem(TOKEN_KEY, nextToken);
        localStorage.setItem(ROLE_KEY, nextRole);
        setToken(nextToken);
        setUserRole(nextRole);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        setToken(null);
        setUserRole(null);
      },
    }),
    [loading, token, userRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
