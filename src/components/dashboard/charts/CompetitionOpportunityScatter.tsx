"use client";

import {
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type UnifiedCluster = {
  clusterId: string;
  currentDemandScore: number;
  previousDemandScore: number;
  growthRate: number;
  competitionIndex: number;
  opportunityScore: number;
  isSurging: boolean;
  latitude: number;
  longitude: number;
};

interface Props {
  clusters: UnifiedCluster[];
  onPointClick?: (cluster: UnifiedCluster) => void;
}

type ScatterPoint = {
  clusterId: string;
  competitionIndex: number;
  opportunityScore: number;
  isSurging: boolean;
};

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ScatterPoint }>;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-xs text-zinc-100 shadow-md">
      <p>
        <span className="text-zinc-400">Cluster:</span> {point.clusterId}
      </p>
      <p>
        <span className="text-zinc-400">Competition:</span> {point.competitionIndex.toFixed(2)}
      </p>
      <p>
        <span className="text-zinc-400">Opportunity:</span> {point.opportunityScore.toFixed(2)}
      </p>
      <p>
        <span className="text-zinc-400">Surging:</span> {point.isSurging ? "Yes" : "No"}
      </p>
    </div>
  );
}

export default function CompetitionOpportunityScatter({ clusters, onPointClick }: Props) {
  if (clusters.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="text-base font-medium text-zinc-100">Competition vs Opportunity</h3>
        <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-zinc-700">
          <span className="text-sm text-zinc-500">No cluster positioning data</span>
        </div>
      </div>
    );
  }

  const data: ScatterPoint[] = clusters.map((cluster) => ({
    clusterId: cluster.clusterId,
    competitionIndex: cluster.competitionIndex,
    opportunityScore: cluster.opportunityScore,
    isSurging: cluster.isSurging,
  }));
  const avgCompetitionIndex =
    data.reduce((sum, point) => sum + point.competitionIndex, 0) / data.length;
  const avgOpportunityScore =
    data.reduce((sum, point) => sum + point.opportunityScore, 0) / data.length;

  const xMin = Math.min(...data.map((point) => point.competitionIndex));
  const xMax = Math.max(...data.map((point) => point.competitionIndex));
  const yMin = Math.min(...data.map((point) => point.opportunityScore));
  const yMax = Math.max(...data.map((point) => point.opportunityScore));

  const xPad = Math.max(1, (xMax - xMin) * 0.1);
  void yMin;
  void yMax;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-base font-medium text-zinc-100">Competition vs Opportunity</h3>
      <div className="mt-4 h-56">
        <ResponsiveContainer height="100%" width="100%">
          <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#3F3F46" strokeDasharray="3 3" />
            <XAxis
              axisLine={{ stroke: "#3F3F46" }}
              dataKey="competitionIndex"
              name="Competition Index"
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              tickLine={false}
              type="number"
            />
            <YAxis
              axisLine={{ stroke: "#3F3F46" }}
              dataKey="opportunityScore"
              name="Opportunity Score"
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              tickLine={false}
              type="number"
            />
            <ReferenceLine
              stroke="#52525B"
              strokeDasharray="4 4"
              x={avgCompetitionIndex}
            />
            <ReferenceLine
              stroke="#52525B"
              strokeDasharray="4 4"
              y={avgOpportunityScore}
            />
            <Tooltip content={<ScatterTooltip />} cursor={{ stroke: "#52525B" }} />
            <Scatter data={data} name="Clusters">
              {data.map((entry, index) => (
                <Cell
                  fill={entry.isSurging ? "#4F7CFF" : "#A1A1AA"}
                  key={`${entry.clusterId}-${entry.competitionIndex}-${entry.opportunityScore}`}
                  onClick={() => onPointClick?.(clusters[index])}
                />
              ))}
            </Scatter>

            <text
              fill="#71717A"
              fontSize={11}
              x={`${((avgCompetitionIndex - (xMin - xPad)) / (xMax - xMin + xPad * 2)) * 50 - 2}%`}
              y={18}
            >
              Expansion Zone
            </text>
            <text
              fill="#71717A"
              fontSize={11}
              textAnchor="end"
              x={`${((avgCompetitionIndex - (xMin - xPad)) / (xMax - xMin + xPad * 2)) * 50 + 52}%`}
              y={18}
            >
              Competitive Hot Zone
            </text>
            <text
              fill="#71717A"
              fontSize={11}
              x={`${((avgCompetitionIndex - (xMin - xPad)) / (xMax - xMin + xPad * 2)) * 50 - 2}%`}
              y="92%"
            >
              Dormant
            </text>
            <text
              fill="#71717A"
              fontSize={11}
              textAnchor="end"
              x={`${((avgCompetitionIndex - (xMin - xPad)) / (xMax - xMin + xPad * 2)) * 50 + 52}%`}
              y="92%"
            >
              Saturated
            </text>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4F7CFF]" />
            Surging
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#A1A1AA]" />
            Normal
          </span>
        </div>
        <span>Opportunity Score vs Competition</span>
      </div>
    </div>
  );
}
