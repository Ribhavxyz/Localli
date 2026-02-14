export interface ClusterAnalytics {
  clusterId: string;
  demandScore: number;
  growthRate: number;
  surge: boolean;
  competitionIndex: number;
  opportunityScore: number;
  latitude: number;
  longitude: number;
}
