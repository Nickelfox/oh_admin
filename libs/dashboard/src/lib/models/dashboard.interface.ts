import { CustomApiResponse } from '@hidden-innovation/shared/models';

export interface DashboardData {
  totalUser: number;
}

export interface DashboardResponse extends CustomApiResponse {
  data: DashboardData;
}
