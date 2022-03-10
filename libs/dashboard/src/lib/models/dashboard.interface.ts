import { CustomApiResponse, DashboardRangeFilterEnum, SortingEnum } from '@hidden-innovation/shared/models';

export interface DashboardData {
  totalUser: number;
}

export interface TestWatched {
  // position:number;
  name: string;
  id: number;
  video_plays: number;
  result_logs: string;
}

export interface TestWatchedFilters {
  videoplaySort: SortingEnum | undefined;
  resultlogSort: SortingEnum | undefined;
}

export interface TestWatchedLimitRequest extends TestWatchedFilters {
  limit: number;
  page: number;
}

export interface TestWatchedListingResponse extends CustomApiResponse {
  data: TestWatchedListingResponseData;
}

export interface TestWatchedListingResponseData {
  test: TestWatched[],
  totalTests: number
}

export interface PackEngagement {
  // position:number;
  name: string;
  id: number;
  video_plays: number;
  resource_clicks: number;
  content_clicks: number;
}

export interface PackEngagementFilters {
  contentclicksSort: SortingEnum | undefined;
  resourceclicksSort: SortingEnum | undefined;
}

export interface PackEngLimitRequest extends PackEngagementFilters {
  limit: number;
  page: number;
}

export interface PackEngagementResponse extends CustomApiResponse {
  data: PackEngLimitRequestResponseData;
}

export interface PackEngLimitRequestResponseData {
  packs: PackEngagement[],
  totalPacks: number
}

export interface AssessmentEngagement {
  // position:number;
  name: string;
  id: number;
  category: string;
  average_score: number;
  completion: number;
}

export interface AssessmentEngagementFilters {
  completionSort: SortingEnum | undefined;
  averagescoreSort: SortingEnum | undefined;
}


export interface AssessmentLimitRequest extends AssessmentEngagementFilters {
  limit: number;
  page: number;
}

export interface DashboardResponse extends CustomApiResponse {
  data: DashboardData;
}


export interface AssessmentEngagementResponse extends CustomApiResponse {
  data: AssessmentEngagement[];
}

export interface DashboardRequest {
  type: DashboardRangeFilterEnum;
  start: string;
  end: string;
}
