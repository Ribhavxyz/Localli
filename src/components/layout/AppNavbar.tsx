"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authFetch } from "@/lib/authFetch";

type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
};

const guestNav: NavItem[] = [{ label: "Home", href: "/" }];
const customerNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Cart", href: "/cart", icon: <span className="text-base">🛒</span> },
  { label: "Orders", href: "/orders" },
];
const vendorNav: NavItem[] = [
  { label: "Dashboard", href: "/vendor", icon: <GridIcon /> },
  { label: "Products", href: "/vendor/products", icon: <CubeIcon /> },
  { label: "Orders", href: "/vendor/orders" },
  { label: "Analytics", href: "/vendor/analytics", icon: <BarsIcon /> },
];
const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Clusters", href: "/admin/clusters" },
  { label: "Heatmap", href: "/admin/heatmap" },
  { label: "Logs", href: "/admin/logs" },
];

export default function AppNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, userRole, logout, loading } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const isAuthed = Boolean(token) && !loading;
  const navItems = useMemo(
    () =>
      !isAuthed
        ? guestNav
        : userRole === "VENDOR"
          ? vendorNav
          : userRole === "ADMIN"
            ? adminNav
            : customerNav,
    [isAuthed, userRole]
  );

  useEffect(() => {
    if (!isAuthed || userRole !== "CUSTOMER") {
      return;
    }

    let active = true;

    async function fetchCartCount() {
      try {
        const response = await authFetch("/api/cart");
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as Array<{ quantity: number }>;
        if (!active || !Array.isArray(data)) {
          return;
        }

        const count = data.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
        setCartCount(count);
      } catch {
        if (active) {
          setCartCount(0);
        }
      }
    }

    void fetchCartCount();

    return () => {
      active = false;
    };
  }, [isAuthed, pathname, userRole]);

  const visibleCartCount = isAuthed && userRole === "CUSTOMER" ? cartCount : 0;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link className="text-lg font-semibold text-white" href="/">
          Localli
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <Link
              className={`relative rounded-lg px-3 py-1.5 text-sm transition ${
                pathname === item.href ? "text-white" : "text-zinc-300 hover:text-white"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.icon ? <span className="mr-1 inline-flex">{item.icon}</span> : null}
              {item.label}
              {item.label === "Cart" && visibleCartCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4F7CFF] px-1 text-xs font-semibold text-white">
                  {visibleCartCount}
                </span>
              ) : null}
            </Link>
          ))}

          {!isAuthed ? (
            <>
              <Link
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-lg bg-[#4F7CFF] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#3f6ef2]"
                href="/signup"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <button
                aria-label="Logout"
                className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#6366F1] text-sm font-semibold uppercase text-white transition hover:brightness-110"
                onClick={handleLogout}
                title="Logout"
                type="button"
              >
                {userRole?.slice(0, 1)}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <rect height="7" rx="1.5" stroke="currentColor" width="7" x="3" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" width="7" x="14" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" width="7" x="3" y="14" />
      <rect height="7" rx="1.5" stroke="currentColor" width="7" x="14" y="14" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M12 12L20 7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12L4 7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12V21" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M4 20V10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M10 20V4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M16 20V14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M22 20V7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
