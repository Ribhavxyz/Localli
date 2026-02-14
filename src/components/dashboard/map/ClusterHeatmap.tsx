"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import L, { type LatLngBoundsExpression } from "leaflet";
import "leaflet.heat";

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

interface ClusterHeatmapProps {
  days: number;
  onMarkerClick?: (cluster: UnifiedCluster) => void;
}

type HeatPoint = [number, number, number];

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

export default function ClusterHeatmap({ days, onMarkerClick }: ClusterHeatmapProps) {
  const [clusters, setClusters] = useState<UnifiedCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMapData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/cluster-intelligence?days=${days}`);
        if (!res.ok) {
          throw new Error("Failed to fetch map data");
        }

        const data = await res.json();
        if (!isMounted) {
          return;
        }

        setClusters(Array.isArray(data.clusters) ? data.clusters : []);
        setError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Failed to load map data");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMapData();

    return () => {
      isMounted = false;
    };
  }, [days]);

  const validClusters = useMemo(
    () => clusters.filter((c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude)),
    [clusters]
  );

  const maxDemand = useMemo(
    () =>
      validClusters.reduce((max, cluster) => Math.max(max, cluster.currentDemandScore), 0) || 1,
    [validClusters]
  );

  const heatPoints = useMemo<HeatPoint[]>(
    () =>
      validClusters.map((cluster) => [
        cluster.latitude,
        cluster.longitude,
        Math.max(0.1, cluster.currentDemandScore / maxDemand),
      ]),
    [maxDemand, validClusters]
  );

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (validClusters.length === 0) {
      return null;
    }

    return validClusters.map((cluster) => [cluster.latitude, cluster.longitude]);
  }, [validClusters]);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700">
        <span className="text-sm text-zinc-500">Loading map...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700">
        <span className="text-sm text-[#FF453A]">{error}</span>
      </div>
    );
  }

  if (validClusters.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700">
        <span className="text-sm text-zinc-500">No clusters available for this period</span>
      </div>
    );
  }

  return (
    <div className="h-72 overflow-hidden rounded-xl border border-zinc-800">
      <MapContainer
        center={DEFAULT_CENTER}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoom={DEFAULT_ZOOM}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer
          max={1}
          points={heatPoints}
          radius={Math.max(18, Math.min(40, 20 + validClusters.length / 2))}
        />

        {bounds ? <FitToBounds bounds={bounds} /> : null}

        {validClusters.map((cluster) => (
          <CircleMarker
            center={[cluster.latitude, cluster.longitude]}
            eventHandlers={{
              click: () => onMarkerClick?.(cluster),
            }}
            key={cluster.clusterId}
            pathOptions={{
              color: "#4F7CFF",
              fillColor: "#4F7CFF",
              fillOpacity: 0.7,
            }}
            radius={4}
          >
            <Popup>
              <div className="text-xs text-zinc-900">
                <p>
                  <strong>Cluster:</strong> {cluster.clusterId}
                </p>
                <p>
                  <strong>Demand:</strong> {cluster.currentDemandScore.toFixed(2)}
                </p>
                <p>
                  <strong>Opportunity:</strong> {cluster.opportunityScore.toFixed(2)}
                </p>
                <p>
                  <strong>Competition:</strong> {cluster.competitionIndex.toFixed(2)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

interface HeatLayerProps {
  points: HeatPoint[];
  radius: number;
  max: number;
}

function HeatLayer({ points, radius, max }: HeatLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      return;
    }

    const layer = (L as unknown as { heatLayer: (p: HeatPoint[], o: object) => L.Layer }).heatLayer(
      points,
      {
        radius,
        blur: 20,
        max,
        minOpacity: 0.35,
        gradient: {
          0.2: "#1D4ED8",
          0.5: "#4F7CFF",
          0.7: "#30D158",
          1.0: "#FF453A",
        },
      }
    );

    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, max, points, radius]);

  return null;
}

interface FitToBoundsProps {
  bounds: LatLngBoundsExpression;
}

function FitToBounds({ bounds }: FitToBoundsProps) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 });
  }, [bounds, map]);

  return null;
}
