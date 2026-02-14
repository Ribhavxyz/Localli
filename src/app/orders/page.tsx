"use client";

import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authFetch";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items?: OrderItem[];
  orderItems?: OrderItem[];
};

type ApiError = {
  message?: string;
};

function formatOrderNumber(id: number): string {
  return `ORD-${String(id + 1000).padStart(4, "0")}`;
}

function formatOrderDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusStyle(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("delivered")) {
    return "bg-emerald-950/60 text-emerald-300";
  }
  if (normalized.includes("transit") || normalized.includes("shipped")) {
    return "bg-blue-950/60 text-blue-300";
  }
  if (normalized.includes("process") || normalized.includes("placed")) {
    return "bg-amber-950/60 text-amber-300";
  }
  return "bg-zinc-800 text-zinc-300";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let active = true;

    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch("/api/orders");
        const data = (await response.json()) as Order[] | ApiError;

        if (!response.ok) {
          throw new Error(!Array.isArray(data) ? data.message ?? "Failed to fetch orders." : "Failed to fetch orders.");
        }

        if (!active) {
          return;
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) {
          return;
        }

        const message = err instanceof Error ? err.message : "Unable to load orders right now.";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchOrders();

    return () => {
      active = false;
    };
  }, []);

  const normalizedOrders = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        items: order.items ?? order.orderItems ?? [],
      })),
    [orders]
  );

  function toggleDetails(orderId: number) {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-5xl font-bold tracking-tight">My Orders</h1>

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-center text-zinc-300">
            Loading orders...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-300">
            {error}
          </div>
        ) : normalizedOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/80 p-10 text-center text-zinc-400">
            You have no orders yet.
          </div>
        ) : (
          <div className="space-y-5">
            {normalizedOrders.map((order) => {
              const isExpanded = expandedOrderIds.has(order.id);
              const items = order.items ?? [];

              return (
                <article
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6"
                  key={order.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-3xl font-semibold text-zinc-100">
                        {formatOrderNumber(order.id)}
                      </p>
                      <p className="mt-1 text-xl text-zinc-400">{formatOrderDate(order.createdAt)}</p>
                    </div>
                    <span
                      className={`rounded-xl px-4 py-2 text-lg font-medium ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-6 h-px bg-zinc-800" />

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-10">
                      <div>
                        <p className="text-base text-zinc-400">Items</p>
                        <p className="text-3xl font-semibold text-zinc-100">{items.length}</p>
                      </div>
                      <div>
                        <p className="text-base text-zinc-400">Total</p>
                        <p className="text-3xl font-semibold text-zinc-100">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="rounded-xl bg-zinc-800 px-5 py-2.5 text-lg font-semibold text-zinc-100 transition hover:bg-zinc-700"
                      onClick={() => toggleDetails(order.id)}
                      type="button"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className="mt-5 rounded-xl border border-zinc-800 bg-black/40 p-4">
                      {items.length === 0 ? (
                        <p className="text-sm text-zinc-400">No item details available.</p>
                      ) : (
                        <ul className="space-y-3">
                          {items.map((item) => (
                            <li
                              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3"
                              key={item.id}
                            >
                              <div>
                                <p className="text-base font-medium text-zinc-100">
                                  Product #{item.productId}
                                </p>
                                <p className="text-sm text-zinc-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-base font-semibold text-zinc-100">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
