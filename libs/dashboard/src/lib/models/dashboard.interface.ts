import { CustomApiResponse, DashboardRangeFilterEnum } from '@hidden-innovation/shared/models';
import { DateTime } from 'luxon';

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
