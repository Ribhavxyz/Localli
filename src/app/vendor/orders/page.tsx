"use client";

import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authFetch";

type VendorOrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
};

type VendorOrder = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  orderItems: VendorOrderItem[];
};

type OrdersError = {
  message?: string;
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch("/api/vendor/orders");
        const data = (await response.json()) as VendorOrder[] | OrdersError;
        if (!response.ok) {
          throw new Error(!Array.isArray(data) ? data.message ?? "Failed to load orders" : "Failed to load orders");
        }

        if (!active) {
          return;
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load orders.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrders();
    return () => {
      active = false;
    };
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  const pendingOrders = useMemo(
    () =>
      orders.filter((order) => {
        const status = order.status.toLowerCase();
        return status.includes("pending") || status.includes("process") || status.includes("placed");
      }).length,
    [orders]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-10 text-center text-zinc-300">
        Loading vendor orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Orders</h1>
        <div className="flex gap-3">
          <StatChip label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
          <StatChip label="Pending Orders" value={pendingOrders.toString()} />
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/90">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-lg">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="px-8 py-5 font-medium">Order ID</th>
                <th className="px-8 py-5 font-medium">Customer</th>
                <th className="px-8 py-5 font-medium">Date</th>
                <th className="px-8 py-5 font-medium">Items</th>
                <th className="px-8 py-5 font-medium">Total</th>
                <th className="px-8 py-5 font-medium">Status</th>
                <th className="px-8 py-5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td className="px-8 py-8 text-zinc-400" colSpan={7}>
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr className="border-b border-zinc-800/70 last:border-b-0" key={order.id}>
                    <td className="px-8 py-6 font-semibold text-zinc-100">ORD-{order.id}</td>
                    <td className="px-8 py-6 text-zinc-200">Customer #{order.id}</td>
                    <td className="px-8 py-6 text-zinc-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-zinc-100">{order.orderItems.length}</td>
                    <td className="px-8 py-6 font-semibold text-zinc-100">${order.total.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className={`rounded-xl px-4 py-1.5 ${statusClass(order.status)}`}>
                        {capitalize(order.status)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        className="text-xl font-semibold text-[#4F7CFF] transition hover:text-[#6A8CFF]"
                        type="button"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-4xl font-bold text-zinc-100">{value}</p>
    </div>
  );
}

function statusClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("completed")) return "bg-emerald-950/60 text-emerald-300";
  if (normalized.includes("transit")) return "bg-violet-950/60 text-violet-300";
  if (normalized.includes("process")) return "bg-blue-950/60 text-blue-300";
  return "bg-amber-950/60 text-amber-300";
}

function capitalize(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
