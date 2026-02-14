"use client";

import { useEffect, useState } from "react";
import { useDashboardFilters } from "@/components/dashboard/layout/DashboardFiltersContext";
import GrowthTrendChart from "@/components/dashboard/charts/GrowthTrendChart";
import CompetitionOpportunityScatter from "@/components/dashboard/charts/CompetitionOpportunityScatter";
import ClusterDetailDrawer from "@/components/dashboard/ClusterDetailDrawer";

import dynamic from "next/dynamic";

const ClusterHeatmap = dynamic(
  () => import("@/components/dashboard/map/ClusterHeatmap"),
  { ssr: false }
);

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

type TrendDirection = "up" | "down" | "flat";

function getTrendDirection(current: number, previous: number): TrendDirection {
  if (current > previous) {
    return "up";
  }

  if (current < previous) {
    return "down";
  }

  return "flat";
}

function getTrendStyles(direction: TrendDirection): { arrow: string; className: string } {
  if (direction === "up") {
    return { arrow: "↑", className: "text-[#30D158]" };
  }

  if (direction === "down") {
    return { arrow: "↓", className: "text-[#FF453A]" };
  }

  return { arrow: "→", className: "text-zinc-400" };
}

export default function DashboardPage() {
  const { days } = useDashboardFilters();
  const [clusters, setClusters] = useState<UnifiedCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<UnifiedCluster | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/cluster-intelligence?days=${days}`);
        if (!res.ok) {
          throw new Error("Failed to fetch intelligence data");
        }
        const data = await res.json();
        setClusters(data.clusters ?? []);
        setError(null);
      } catch {
        setError("Failed to load intelligence data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [days]);

  const totalClusters = clusters.length;
  const surgingZones = clusters.filter((c) => c.isSurging).length;
  const avgOpportunity =
    clusters.length > 0
      ? clusters.reduce((sum, c) => sum + c.opportunityScore, 0) / clusters.length
      : 0;
  const avgPreviousOpportunity =
    clusters.length > 0
      ? clusters.reduce((sum, c) => sum + c.previousDemandScore / (c.competitionIndex + 1), 0) /
        clusters.length
      : 0;
  const highCompetition = clusters.filter((c) => c.competitionIndex > 5).length;
  const previousSurgingZones = clusters.filter((c) => c.previousDemandScore >= 20).length;
  const surgingTrend = getTrendDirection(surgingZones, previousSurgingZones);
  const opportunityTrend = getTrendDirection(avgOpportunity, avgPreviousOpportunity);
  const surgingTrendStyle = getTrendStyles(surgingTrend);
  const opportunityTrendStyle = getTrendStyles(opportunityTrend);

  const avgOpportunityValueClass =
    avgOpportunity >= 10 ? "text-[#30D158]" : "text-white";
  const highCompetitionValueClass =
    highCompetition > 0 ? "text-[#FF453A]" : "text-white";

  return (
    <div className="px-6 py-8">
      {loading ? <p className="mb-6 text-sm text-zinc-400">Loading intelligence...</p> : null}
      {error ? <p className="mb-6 text-sm text-[#FF453A]">{error}</p> : null}

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-lg">
          <p className="text-sm text-zinc-400">Total Clusters</p>
          <p className="mt-3 text-4xl font-bold text-white">{totalClusters}</p>
          <p className="mt-2 text-xs text-zinc-400">+12% vs last period</p>
        </div>

        <div className="animate-fade-in delay-75 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-lg">
          <p className="text-sm text-zinc-400">Surging Zones</p>
          <div className="mt-3 flex items-center gap-2">
            <p className="text-4xl font-bold text-white">{surgingZones}</p>
            <span className={`text-lg font-semibold ${surgingTrendStyle.className}`}>
              {surgingTrendStyle.arrow}
            </span>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#4F7CFF]" />
            <span>Active now</span>
          </div>
        </div>

        <div className="animate-fade-in delay-150 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-lg">
          <p className="text-sm text-zinc-400">Avg Opportunity Score</p>
          <div className="mt-3 flex items-center gap-2">
            <p className={`text-4xl font-bold ${avgOpportunityValueClass}`}>
              {avgOpportunity.toFixed(1)}
            </p>
            <span className={`text-lg font-semibold ${opportunityTrendStyle.className}`}>
              {opportunityTrendStyle.arrow}
            </span>
          </div>
          <div className="mt-2 inline-flex items-center rounded-full bg-[#30D158]/20 px-2 py-1 text-xs text-[#30D158]">
            Strong
          </div>
        </div>

        <div className="animate-fade-in delay-200 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-lg">
          <p className="text-sm text-zinc-400">High Competition Areas</p>
          <p className={`mt-3 text-4xl font-bold ${highCompetitionValueClass}`}>
            {highCompetition}
          </p>
          <div className="mt-2 inline-flex items-center rounded-full bg-[#FF453A]/20 px-2 py-1 text-xs text-[#FF453A]">
            Watchlist
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium text-zinc-200">Opportunity Heat Map</h2>
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <ClusterHeatmap days={days} onMarkerClick={setSelectedCluster} />
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loading ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-base font-medium text-zinc-100">Growth Trend</h3>
            <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-zinc-700">
              <span className="text-sm text-zinc-500">Loading growth chart...</span>
            </div>
          </div>
        ) : (
          <GrowthTrendChart days={days} clusters={clusters} />
        )}

        <CompetitionOpportunityScatter clusters={clusters} onPointClick={setSelectedCluster} />
      </section>

      <ClusterDetailDrawer
        cluster={selectedCluster}
        onClose={() => setSelectedCluster(null)}
      />
    </div>
  );
}
