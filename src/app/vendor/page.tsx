"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AnalyticsResponse = {
  totalProducts: number;
  totalClicks: number;
  totalCartAdds: number;
  totalPurchases: number;
  totalRevenue: number;
};

type VendorOrder = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  orderItems: Array<{ id: number; productId: number; quantity: number; price: number }>;
};

export default function VendorDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [storeRes, analyticsRes, ordersRes] = await Promise.all([
          authFetch("/api/vendor/store"),
          authFetch("/api/vendor/analytics"),
          authFetch("/api/vendor/orders"),
        ]);

        if (storeRes.status === 404) {
          router.replace("/vendor/store");
          return;
        }

        if (!storeRes.ok || !analyticsRes.ok || !ordersRes.ok) {
          throw new Error("Failed to load vendor dashboard");
        }

        const analyticsData = (await analyticsRes.json()) as AnalyticsResponse;
        const ordersData = (await ordersRes.json()) as VendorOrder[];
        if (!active) {
          return;
        }

        setAnalytics(analyticsData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load dashboard");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();
    return () => {
      active = false;
    };
  }, [router]);

  const weeklyRevenueData = useMemo(() => buildWeeklyRevenueData(orders), [orders]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-10 text-center text-zinc-300">
        Loading dashboard...
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-300">
        {error ?? "Failed to load dashboard"}
      </div>
    );
  }

  const avgOrderValue =
    analytics.totalPurchases > 0 ? analytics.totalRevenue / analytics.totalPurchases : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Vendor Dashboard</h1>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Products" value={analytics.totalProducts.toString()} tone="blue" note="+4 this week" />
        <MetricCard label="Total Orders" value={analytics.totalPurchases.toString()} tone="green" note="+12% vs last week" />
        <MetricCard label="Revenue" value={`$${analytics.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} tone="amber" note="+18% vs last week" />
        <MetricCard label="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} tone="purple" note="+5% increase" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <h2 className="text-4xl font-semibold">Weekly Revenue</h2>
          <div className="mt-5 h-[380px]">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={weeklyRevenueData} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                <XAxis
                  axisLine={{ stroke: "#3F3F46" }}
                  dataKey="label"
                  tick={{ fill: "#A1A1AA", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={{ stroke: "#3F3F46" }}
                  tick={{ fill: "#A1A1AA", fontSize: 12 }}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1C1E",
                    border: "1px solid #3F3F46",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                  }}
                  formatter={(value: number | string | undefined) => {
                    const numeric = typeof value === "number" ? value : Number(value ?? 0);
                    return [`$${numeric.toFixed(2)}`, "Revenue"];
                  }}
                  labelStyle={{ color: "#FFFFFF" }}
                />
                <Line
                  dataKey="revenue"
                  dot={{ fill: "#4F7CFF", r: 5, strokeWidth: 0 }}
                  stroke="#4F7CFF"
                  strokeWidth={4}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <h2 className="text-4xl font-semibold">Recent Orders</h2>
          <div className="mt-5 space-y-4">
            {orders.length === 0 ? (
              <p className="text-zinc-400">No recent orders.</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div className="border-b border-zinc-800 pb-4 last:border-b-0" key={order.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-3xl font-semibold">ORD-{order.id}</p>
                    <span className={`rounded-xl px-3 py-1 text-lg ${statusStyle(order.status)}`}>
                      {order.status.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-xl text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-3xl font-semibold">${order.total.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "blue" | "green" | "amber" | "purple";
}) {
  const colorMap: Record<"blue" | "green" | "amber" | "purple", string> = {
    blue: "text-blue-400",
    green: "text-emerald-400",
    amber: "text-amber-400",
    purple: "text-violet-400",
  };

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
      <p className="text-2xl text-zinc-400">{label}</p>
      <p className={`mt-4 text-6xl font-bold ${colorMap[tone]}`}>{value}</p>
      <p className="mt-2 text-lg text-[#30D158]">{note}</p>
    </article>
  );
}

function statusStyle(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("completed")) return "bg-emerald-950/60 text-emerald-300";
  if (normalized.includes("process") || normalized.includes("placed"))
    return "bg-amber-950/60 text-amber-300";
  if (normalized.includes("transit")) return "bg-violet-950/60 text-violet-300";
  return "bg-blue-950/60 text-blue-300";
}

function buildWeeklyRevenueData(orders: VendorOrder[]): Array<{ label: string; revenue: number }> {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  const buckets = new Map<string, number>();
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = day.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const order of orders) {
    const created = new Date(order.createdAt);
    if (Number.isNaN(created.getTime())) {
      continue;
    }

    created.setHours(0, 0, 0, 0);
    const key = created.toISOString().slice(0, 10);
    if (!buckets.has(key)) {
      continue;
    }
    buckets.set(key, (buckets.get(key) ?? 0) + order.total);
  }

  return Array.from(buckets.entries()).map(([key, revenue]) => ({
    label: new Date(key).toLocaleDateString(undefined, { weekday: "short" }),
    revenue: Number(revenue.toFixed(2)),
  }));
}
