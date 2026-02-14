"use client";

import { useEffect, useState } from "react";

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

export default function AdminClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadClusters() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/analytics/cluster-intelligence?days=14");
        if (!response.ok) {
          throw new Error("Failed to load clusters");
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
        setError(err instanceof Error ? err.message : "Unable to load clusters");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadClusters();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Clusters</h1>

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-zinc-300">
          Loading clusters...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-300">
          {error}
        </div>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/90">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-lg">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-7 py-4 font-medium">Cluster ID</th>
                  <th className="px-7 py-4 font-medium">Demand</th>
                  <th className="px-7 py-4 font-medium">Growth %</th>
                  <th className="px-7 py-4 font-medium">Competition</th>
                  <th className="px-7 py-4 font-medium">Opportunity</th>
                  <th className="px-7 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {clusters.length === 0 ? (
                  <tr>
                    <td className="px-7 py-6 text-zinc-400" colSpan={6}>
                      No clusters available.
                    </td>
                  </tr>
                ) : (
                  clusters.map((cluster) => (
                    <tr className="border-b border-zinc-800/60 last:border-b-0" key={cluster.clusterId}>
                      <td className="px-7 py-5 font-semibold text-zinc-100">{cluster.clusterId}</td>
                      <td className="px-7 py-5 text-zinc-200">{cluster.currentDemandScore.toFixed(2)}</td>
                      <td className="px-7 py-5 text-zinc-200">{cluster.growthRate.toFixed(1)}%</td>
                      <td className="px-7 py-5 text-zinc-200">{cluster.competitionIndex.toFixed(2)}</td>
                      <td className="px-7 py-5 text-zinc-200">{cluster.opportunityScore.toFixed(2)}</td>
                      <td className="px-7 py-5">
                        <span
                          className={`rounded-lg px-3 py-1 text-sm ${
                            cluster.isSurging
                              ? "bg-emerald-950/60 text-emerald-300"
                              : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {cluster.isSurging ? "Surging" : "Stable"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
