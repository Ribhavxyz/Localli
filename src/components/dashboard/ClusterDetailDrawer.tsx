"use client";

import { useEffect } from "react";

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

interface Props {
  cluster: UnifiedCluster | null;
  onClose: () => void;
}

function getRecommendation(cluster: UnifiedCluster): string {
  const highOpportunity = cluster.opportunityScore >= 10;
  const lowCompetition = cluster.competitionIndex <= 5;
  const highDemand = cluster.currentDemandScore >= 20;
  const highCompetition = cluster.competitionIndex > 10;

  if (highOpportunity && lowCompetition) {
    return "High opportunity zone. Consider vendor expansion.";
  }

  if (highCompetition && highDemand) {
    return "High demand but competitive market.";
  }

  return "Moderate market activity.";
}

export default function ClusterDetailDrawer({ cluster, onClose }: Props) {
  const isVisible = cluster !== null;

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("overflow-hidden");
      return () => {
        document.body.classList.remove("overflow-hidden");
      };
    }

    document.body.classList.remove("overflow-hidden");
    return undefined;
  }, [isVisible]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        aria-label="Close cluster detail drawer"
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        type="button"
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full border-l border-zinc-800 bg-zinc-950 p-6 transition-transform duration-300 ease-in-out sm:w-[420px] ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Cluster Details</h2>
          <button
            aria-label="Close drawer"
            className="rounded-lg border border-zinc-700 px-2 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        {cluster ? (
          <>
            <div className="mt-6 space-y-3 text-sm text-zinc-300">
              <p>
                <span className="text-zinc-500">Cluster ID:</span> {cluster.clusterId}
              </p>
              <p>
                <span className="text-zinc-500">Current Demand Score:</span>{" "}
                {cluster.currentDemandScore.toFixed(2)}
              </p>
              <p>
                <span className="text-zinc-500">Previous Demand Score:</span>{" "}
                {cluster.previousDemandScore.toFixed(2)}
              </p>
              <p>
                <span className="text-zinc-500">Growth %:</span> {cluster.growthRate.toFixed(2)}%
              </p>
              <p className="flex items-center gap-2">
                <span className="text-zinc-500">Surging:</span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                    cluster.isSurging
                      ? "bg-[#4F7CFF]/20 text-[#4F7CFF]"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {cluster.isSurging ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <span className="text-zinc-500">Competition Index:</span>{" "}
                {cluster.competitionIndex.toFixed(2)}
              </p>
              <p>
                <span className="text-zinc-500">Opportunity Score:</span>{" "}
                {cluster.opportunityScore.toFixed(2)}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="text-sm font-medium text-zinc-100">Recommendation</h3>
              <p className="mt-2 text-sm text-zinc-400">{getRecommendation(cluster)}</p>
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}
