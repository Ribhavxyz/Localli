"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ClusterHeatmap = dynamic(
  () => import("@/components/dashboard/map/ClusterHeatmap"),
  { ssr: false }
);

export default function AdminHeatmapPage() {
  const [days, setDays] = useState(14);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Heatmap</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-400" htmlFor="admin-heatmap-days">
            Window
          </label>
          <select
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-[#4F7CFF] focus:ring-2"
            id="admin-heatmap-days"
            onChange={(event) => setDays(Number(event.target.value))}
            value={days}
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
        <ClusterHeatmap days={days} />
      </section>
    </div>
  );
}
