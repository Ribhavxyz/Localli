"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const navItems = [
    { href: "/admin", label: "Overview", icon: <GridIcon /> },
    { href: "/admin/clusters", label: "Clusters", icon: <LayersIcon /> },
    { href: "/admin/heatmap", label: "Heatmap", icon: <MapIcon /> },
    { href: "/admin/logs", label: "Logs", icon: <FileIcon /> },
  ];

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="flex min-h-screen">
          <aside className="hidden w-[300px] border-r border-zinc-800 bg-zinc-900/70 lg:flex lg:flex-col">
            <div className="border-b border-zinc-800 px-7 py-8">
              <Link className="text-[42px] font-semibold leading-none text-white" href="/admin">
                Localli
              </Link>
              <p className="mt-3 text-lg text-zinc-400">Intelligence Dashboard</p>
            </div>

            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-3xl transition ${
                      pathname === item.href
                        ? "bg-[#4F7CFF]/20 text-[#4F7CFF]"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <span className="inline-flex">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="border-t border-zinc-800 px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#6366F1] text-lg font-semibold">
                    A
                  </span>
                  <div>
                    <p className="text-lg font-semibold">Admin User</p>
                    <p className="text-sm text-zinc-400">Admin</p>
                  </div>
                </div>
                <button
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <header className="border-b border-zinc-800 px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-base text-zinc-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>System Active</span>
                </div>
                <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100">
                  Last 7 days
                </div>
              </div>
            </header>

            <main className="px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <rect height="7" rx="1.5" stroke="currentColor" width="7" x="3" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" width="7" x="14" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" width="7" x="3" y="14" />
      <rect height="7" rx="1.5" stroke="currentColor" width="7" x="14" y="14" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M12 4L21 8.5L12 13L3 8.5L12 4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12L12 16.5L21 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 15.5L12 20L21 15.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M9 4L3 6V20L9 18L15 20L21 18V4L15 6L9 4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 4V18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 6V20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M7 3H14L20 9V21H7V3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 3V9H20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 13H17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 17H17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
