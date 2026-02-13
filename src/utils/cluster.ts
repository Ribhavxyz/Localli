const GRID_SIZE = 0.01;

export function calculateClusterId(
  latitude: number,
  longitude: number
): string {
  const clusterLat = Math.floor(latitude / GRID_SIZE);
  const clusterLng = Math.floor(longitude / GRID_SIZE);

  return `${clusterLat}_${clusterLng}`;
}
