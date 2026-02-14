"use client";

import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import {
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TopProduct = {
  id: number;
  name: string;
  totalPurchases: number;
};

type VendorAnalytics = {
  totalProducts: number;
  totalClicks: number;
  totalCartAdds: number;
  totalPurchases: number;
  totalRevenue: number;
  topProducts: TopProduct[];
  categorySales: Array<{
    category: string;
    revenue: number;
    unitsSold: number;
    orders: number;
  }>;
};

type VendorOrder = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  orderItems: Array<{ id: number; productId: number; quantity: number; price: number }>;
};

type AnalyticsError = {
  message?: string;
};

export default function VendorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);

        const [analyticsRes, ordersRes] = await Promise.all([
          authFetch("/api/vendor/analytics"),
          authFetch("/api/vendor/orders"),
        ]);

        const analyticsData = (await analyticsRes.json()) as VendorAnalytics | AnalyticsError;
        const ordersData = (await ordersRes.json()) as VendorOrder[] | AnalyticsError;

        if (!analyticsRes.ok) {
          throw new Error(
            !("totalRevenue" in analyticsData)
              ? analyticsData.message ?? "Failed to load analytics"
              : "Failed to load analytics"
          );
        }
        if (!ordersRes.ok) {
          throw new Error(
            !Array.isArray(ordersData)
              ? ordersData.message ?? "Failed to load analytics orders"
              : "Failed to load analytics orders"
          );
        }

        if (!active) {
          return;
        }

        setAnalytics(analyticsData as VendorAnalytics);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load analytics.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAnalytics();
    return () => {
      active = false;
    };
  }, []);

  const avgOrderValue = useMemo(() => {
    if (!analytics || analytics.totalPurchases === 0) {
      return 0;
    }
    return analytics.totalRevenue / analytics.totalPurchases;
  }, [analytics]);

  const trendData = useMemo(() => buildMonthlyTrend(orders), [orders]);
  const pieData = useMemo(
    () =>
      (analytics?.categorySales ?? []).slice(0, 4).map((category) => ({
        name: category.category,
        value: category.revenue,
      })),
    [analytics]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-10 text-center text-zinc-300">
        Loading analytics...
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-300">
        {error ?? "Failed to load analytics."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Analytics</h1>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard label="Total Revenue" value={`$${analytics.totalRevenue.toLocaleString()}`} accent="blue" />
        <AnalyticsCard label="Total Orders" value={analytics.totalPurchases.toString()} accent="green" />
        <AnalyticsCard label="New Customers" value={Math.max(analytics.totalClicks - analytics.totalCartAdds, 0).toString()} accent="amber" />
        <AnalyticsCard label="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} accent="purple" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <h2 className="text-4xl font-semibold">Revenue &amp; Orders Trend</h2>
          <div className="mt-5 h-[400px]">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                <CartesianGrid stroke="#2f2f34" strokeDasharray="4 6" />
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
                  yAxisId="left"
                />
                <YAxis
                  axisLine={{ stroke: "#3F3F46" }}
                  orientation="right"
                  tick={{ fill: "#A1A1AA", fontSize: 12 }}
                  tickLine={false}
                  yAxisId="right"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1C1E",
                    border: "1px solid #3F3F46",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                  }}
                  formatter={(value: number | string | undefined, name: string) => {
                    const numeric = typeof value === "number" ? value : Number(value ?? 0);
                    return name === "Revenue"
                      ? [`$${numeric.toFixed(2)}`, name]
                      : [numeric, name];
                  }}
                  labelStyle={{ color: "#FFFFFF" }}
                />
                <Legend wrapperStyle={{ color: "#A1A1AA" }} />
                <Line
                  dataKey="revenue"
                  dot={{ fill: "#4F7CFF", r: 4, strokeWidth: 0 }}
                  name="Revenue"
                  stroke="#4F7CFF"
                  strokeWidth={3}
                  type="monotone"
                  yAxisId="left"
                />
                <Line
                  dataKey="orders"
                  dot={{ fill: "#30D158", r: 4, strokeWidth: 0 }}
                  name="Orders"
                  stroke="#30D158"
                  strokeWidth={3}
                  type="monotone"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <h2 className="text-4xl font-semibold">Sales by Category</h2>
          <div className="mt-5 h-[400px]">
            {pieData.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-700 text-zinc-400">
                No purchase data yet.
              </div>
            ) : (
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
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
                  <Legend wrapperStyle={{ color: "#A1A1AA", fontSize: "12px" }} />
                  <Pie
                    cx="50%"
                    cy="45%"
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    nameKey="name"
                    outerRadius={120}
                  >
                    {pieData.map((_, index) => (
                      <Cell fill={PIE_COLORS[index % PIE_COLORS.length]} key={index} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticsCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "blue" | "green" | "amber" | "purple";
}) {
  const accentClasses: Record<typeof accent, string> = {
    blue: "text-blue-400",
    green: "text-emerald-400",
    amber: "text-amber-400",
    purple: "text-violet-400",
  };

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
      <p className="text-2xl text-zinc-400">{label}</p>
      <p className={`mt-4 text-6xl font-bold ${accentClasses[accent]}`}>{value}</p>
      <p className="mt-2 text-lg text-[#30D158]">+ from last month</p>
    </article>
  );
}

function buildMonthlyTrend(
  orders: VendorOrder[]
): Array<{ label: string; revenue: number; orders: number }> {
  const today = new Date();
  const months: Array<{ key: string; label: string }> = [];

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.push({
      key,
      label: date.toLocaleDateString(undefined, { month: "short" }),
    });
  }

  const bucket = new Map<string, { revenue: number; orders: number }>();
  for (const month of months) {
    bucket.set(month.key, { revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    const created = new Date(order.createdAt);
    if (Number.isNaN(created.getTime())) {
      continue;
    }
    const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
    if (!bucket.has(key)) {
      continue;
    }
    const current = bucket.get(key)!;
    current.revenue += order.total;
    current.orders += 1;
    bucket.set(key, current);
  }

  return months.map((month) => {
    const values = bucket.get(month.key) ?? { revenue: 0, orders: 0 };
    return {
      label: month.label,
      revenue: Number(values.revenue.toFixed(2)),
      orders: values.orders,
    };
  });
}

const PIE_COLORS = ["#4F7CFF", "#30D158", "#F59E0B", "#8B5CF6"];
