import { NextRequest, NextResponse } from "next/server";

type DemandCluster = {
  clusterId: string;
  currentDemandScore: number;
  previousDemandScore: number;
  growthRate: number;
  isSurging: boolean;
  latitude?: number;
  longitude?: number;
};

type CompetitionCluster = {
  clusterId: string;
  competitionIndex: number;
  opportunityScore: number;
  latitude?: number;
  longitude?: number;
};

type DemandResponse = {
  clusters: DemandCluster[];
};

type CompetitionResponse = {
  clusters: CompetitionCluster[];
};

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");

    if (daysParam === null || daysParam.trim() === "") {
      return NextResponse.json(
        { message: "days query parameter is required" },
        { status: 400 }
      );
    }

    const days = Number(daysParam);
    if (!Number.isFinite(days) || days <= 0) {
      return NextResponse.json(
        { message: "days must be a positive number" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

    const demandRes = await fetch(
      `${baseUrl}/api/analytics/cluster-demand?days=${days}`,
      { cache: "no-store" }
    );
    const competitionRes = await fetch(
      `${baseUrl}/api/analytics/cluster-competition?days=${days}`,
      { cache: "no-store" }
    );

    if (!demandRes.ok || !competitionRes.ok) {
      return NextResponse.json(
        { message: "Failed to fetch upstream analytics endpoints" },
        { status: 502 }
      );
    }

    const demandData = (await demandRes.json()) as DemandResponse;
    const competitionData = (await competitionRes.json()) as CompetitionResponse;

    const demandClusters = Array.isArray(demandData.clusters) ? demandData.clusters : [];
    const competitionClusters = Array.isArray(competitionData.clusters)
      ? competitionData.clusters
      : [];

    const competitionByClusterId = new Map<string, CompetitionCluster>(
      competitionClusters.map((cluster) => [cluster.clusterId, cluster])
    );

    const mergedClusters: UnifiedCluster[] = demandClusters.map((cluster) => {
      const competition = competitionByClusterId.get(cluster.clusterId);

      return {
        clusterId: cluster.clusterId,
        currentDemandScore: cluster.currentDemandScore,
        previousDemandScore: cluster.previousDemandScore,
        growthRate: cluster.growthRate,
        isSurging: cluster.isSurging,
        competitionIndex: competition?.competitionIndex ?? 0,
        opportunityScore: competition?.opportunityScore ?? 0,
        latitude: cluster.latitude ?? competition?.latitude ?? 0,
        longitude: cluster.longitude ?? competition?.longitude ?? 0,
      };
    });

    return NextResponse.json({ clusters: mergedClusters }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to compute unified cluster intelligence analytics" },
      { status: 500 }
    );
  }
}
