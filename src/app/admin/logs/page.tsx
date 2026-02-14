"use client";

import { useEffect, useMemo, useState } from "react";

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

type LogEntry = {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "success";
  message: string;
};

export default function AdminLogsPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/analytics/cluster-intelligence?days=7");
        if (!response.ok) {
          throw new Error("Failed to load logs data");
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
        setError(err instanceof Error ? err.message : "Unable to load logs");
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

  const logs = useMemo<LogEntry[]>(() => {
    const now = new Date();
    const entries: LogEntry[] = [];

    for (const cluster of clusters) {
      if (cluster.isSurging) {
        entries.push({
          id: `surge-${cluster.clusterId}`,
          timestamp: now.toISOString(),
          level: "success",
          message: `Cluster ${cluster.clusterId} marked as surging (${cluster.growthRate.toFixed(
            1
          )}% growth).`,
        });
      }

      if (cluster.competitionIndex >= 6) {
        entries.push({
          id: `comp-${cluster.clusterId}`,
          timestamp: now.toISOString(),
          level: "warning",
          message: `Cluster ${cluster.clusterId} high competition index ${cluster.competitionIndex.toFixed(
            2
          )}.`,
        });
      }

      if (!cluster.isSurging && cluster.growthRate < 0) {
        entries.push({
          id: `drop-${cluster.clusterId}`,
          timestamp: now.toISOString(),
          level: "info",
          message: `Cluster ${cluster.clusterId} demand declined by ${Math.abs(
            cluster.growthRate
          ).toFixed(1)}%.`,
        });
      }
    }

    return entries.slice(0, 25);
  }, [clusters]);

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Logs</h1>

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-zinc-300">
          Loading logs...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-300">
          {error}
        </div>
      ) : (
        <section className="space-y-3">
          {logs.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 text-zinc-400">
              No recent events.
            </div>
          ) : (
            logs.map((log) => (
              <article
                className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4"
                key={log.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`rounded-md px-2 py-1 text-xs uppercase tracking-wide ${
                      log.level === "success"
                        ? "bg-emerald-950/60 text-emerald-300"
                        : log.level === "warning"
                          ? "bg-amber-950/60 text-amber-300"
                          : "bg-blue-950/60 text-blue-300"
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-200">{log.message}</p>
              </article>
            ))
          )}
        </section>
      )}
    </div>
  );
}
