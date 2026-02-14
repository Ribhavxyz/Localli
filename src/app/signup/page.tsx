"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/context/AuthContext";

type SignupResponse = {
  message?: string;
};

type LoginResponse = {
  token: string;
  message?: string;
};

type MeResponse = {
  user: {
    role: UserRole;
  };
};

async function getRoleFromToken(token: string): Promise<UserRole> {
  const meResponse = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!meResponse.ok) {
    throw new Error("Unable to resolve user role");
  }

  const meData = (await meResponse.json()) as MeResponse;
  if (
    meData.user.role !== "CUSTOMER" &&
    meData.user.role !== "VENDOR" &&
    meData.user.role !== "ADMIN"
  ) {
    throw new Error("Invalid user role");
  }

  return meData.user.role;
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email,
          password,
          role,
        }),
      });

      const signupData = (await signupResponse.json()) as SignupResponse;
      if (!signupResponse.ok) {
        throw new Error(signupData.message ?? "Unable to sign up. Please try again.");
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = (await loginResponse.json()) as LoginResponse;
      if (!loginResponse.ok || !loginData.token) {
        throw new Error(loginData.message ?? "Account created, but auto login failed.");
      }

      const resolvedRole = await getRoleFromToken(loginData.token);
      login(loginData.token, resolvedRole);

      if (resolvedRole === "VENDOR") {
        router.replace("/vendor");
      } else {
        router.replace("/");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign up. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">Get Started</h1>
          <p className="mt-3 text-xl text-zinc-400 md:text-2xl">Create your Localli account</p>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[560px] rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400" htmlFor="name">
                Full Name
              </label>
              <input
                className="w-full rounded-xl border border-zinc-800 bg-black px-5 py-4 text-2xl text-white outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                id="name"
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
                required
                type="text"
                value={name}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-zinc-800 bg-black px-5 py-4 text-2xl text-white outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400" htmlFor="password">
                Password
              </label>
              <input
                className="w-full rounded-xl border border-zinc-800 bg-black px-5 py-4 text-2xl text-white outline-none ring-[#4F7CFF] placeholder:text-zinc-500 focus:ring-2"
                id="password"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400" htmlFor="role">
                I want to
              </label>
              <select
                className="w-full rounded-xl border border-zinc-800 bg-black px-5 py-4 text-2xl text-white outline-none ring-[#4F7CFF] focus:ring-2"
                id="role"
                onChange={(event) => setRole(event.target.value as UserRole)}
                value={role}
              >
                <option value="CUSTOMER">Shop locally</option>
                <option value="VENDOR">Sell as a vendor</option>
              </select>
            </div>

            {error ? <p className="text-lg text-[#FF453A]">{error}</p> : null}

            <button
              className="w-full rounded-xl bg-[#4F7CFF] px-5 py-4 text-3xl font-semibold text-white transition hover:bg-[#3f6ef2] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-lg text-zinc-400">
            Already have an account?{" "}
            <a className="text-[#4F7CFF] transition hover:text-[#6A8CFF]" href="/login">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
