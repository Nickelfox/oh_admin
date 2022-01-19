import { CustomApiResponse, DashboardRangeFilterEnum } from '@hidden-innovation/shared/models';

export interface DashboardData {
  totalUser: number;
}

export interface DashboardResponse extends CustomApiResponse {
  data: DashboardData;
}

export interface DashboardRequest {
  type: DashboardRangeFilterEnum;
  start: string;
  end: string;
}
