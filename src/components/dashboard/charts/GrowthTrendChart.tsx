"use client";

import { useMemo } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type UnifiedCluster = {
  clusterId: string;
  currentDemandScore: number;
  previousDemandScore: number;
  growthRate: number;
  isSurging: boolean;
  competitionIndex: number;
  opportunityScore: number;
  latitude: number;
  longitude: number;
};

interface GrowthTrendChartProps {
  days: number;
  clusters: UnifiedCluster[];
}

type GrowthPoint = {
  period: "Prev Window" | "Curr Window";
  demand: number;
};

function buildGrowthSeries(clusters: UnifiedCluster[]): GrowthPoint[] {
  const sumPrev = clusters.reduce((sum, cluster) => sum + cluster.previousDemandScore, 0);
  const sumCurr = clusters.reduce((sum, cluster) => sum + cluster.currentDemandScore, 0);

  return [
    { period: "Prev Window", demand: Number(sumPrev.toFixed(2)) },
    { period: "Curr Window", demand: Number(sumCurr.toFixed(2)) },
  ];
}

export default function GrowthTrendChart({ days, clusters }: GrowthTrendChartProps) {
  const data = useMemo(() => buildGrowthSeries(clusters), [clusters]);

  if (clusters.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="text-base font-medium text-zinc-100">Growth Trend</h3>
        <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-zinc-700">
          <span className="text-sm text-zinc-500">No growth data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-base font-medium text-zinc-100">Growth Trend ({days} days)</h3>
      <div className="mt-4 h-56">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <XAxis
              axisLine={{ stroke: "#3F3F46" }}
              dataKey="period"
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              axisLine={{ stroke: "#3F3F46" }}
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              tickLine={false}
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
                return [numeric.toFixed(2), "Demand"];
              }}
              labelStyle={{ color: "#FFFFFF" }}
            />
            <Legend wrapperStyle={{ color: "#A1A1AA", fontSize: "12px" }} />
            <Line
              dataKey="demand"
              dot={{ fill: "#4F7CFF", r: 5, strokeWidth: 0 }}
              name="Total Demand"
              stroke="#4F7CFF"
              strokeWidth={3}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
