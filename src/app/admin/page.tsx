"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import GrowthTrendChart from "@/components/dashboard/charts/GrowthTrendChart";
import CompetitionOpportunityScatter from "@/components/dashboard/charts/CompetitionOpportunityScatter";

type Cluster = {
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

export default function AdminOverviewPage() {
  const ClusterHeatmap = dynamic(
    () => import("@/components/dashboard/map/ClusterHeatmap"),
    { ssr: false }
  );
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/analytics/cluster-intelligence?days=14");
        if (!response.ok) {
          throw new Error("Failed to load intelligence data");
        }
        const data = (await response.json()) as { clusters?: Cluster[] };
        if (!active) {
          return;
        }
        setClusters(Array.isArray(data.clusters) ? data.clusters : []);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load admin overview");
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
  }, []);

  const metrics = useMemo(() => {
    const totalClusters = clusters.length;
    const surging = clusters.filter((cluster) => cluster.isSurging).length;
    const highCompetition = clusters.filter((cluster) => cluster.competitionIndex >= 5).length;
    const avgOpportunity =
      totalClusters > 0
        ? clusters.reduce((sum, cluster) => sum + cluster.opportunityScore, 0) / totalClusters
        : 0;

    return { totalClusters, surging, highCompetition, avgOpportunity };
  }, [clusters]);

  return (
    <div className="space-y-8">
      <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Intelligence Overview</h1>

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-zinc-300">
          Loading overview...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-300">
          {error}
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Clusters"
              note="+12% vs last week"
              value={metrics.totalClusters.toString()}
            />
            <MetricCard label="Surging Zones" note="Active now" value={metrics.surging.toString()} />
            <MetricCard
              label="Avg Opportunity Score"
              note="Above target"
              value={metrics.avgOpportunity.toFixed(1)}
            />
            <MetricCard
              label="High Competition Areas"
              note="Monitor closely"
              value={metrics.highCompetition.toString()}
            />
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6">
            <h2 className="text-[2rem] font-semibold text-white">Cluster Demand Heatmap</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800">
              <ClusterHeatmap days={7} />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <GrowthTrendChart days={7} clusters={clusters} />
            <CompetitionOpportunityScatter clusters={clusters} />
          </section>
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6">
      <p className="text-2xl text-zinc-400">{label}</p>
      <p className="mt-3 text-6xl font-bold text-zinc-100">{value}</p>
      <p className="mt-2 text-lg text-zinc-400">{note}</p>
    </article>
  );
}
