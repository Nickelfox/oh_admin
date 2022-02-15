import { CustomApiResponse, DashboardRangeFilterEnum } from '@hidden-innovation/shared/models';

export interface DashboardData {
  totalUser: number;
}

export interface TestWatched {
  // position:number;
  name:string;
  id:number;
  video_plays:number;
  result_logs:string;
}

export interface PackEngagement {
  // position:number;
  name:string;
  id:number;
  video_plays:number;
  resource_clicks:number;
  content_clicks:number;
}
export interface AssessmentEngagement {
  // position:number;
  name:string;
  id:number;
  category:string;
  average_score:number;
  completion:number;
}

export interface DashboardResponse extends CustomApiResponse {
  data: DashboardData;
}
export  interface TestWatchedListingResponse extends  CustomApiResponse{
  data: TestWatched[];
}
export  interface PackEngagementResponse extends  CustomApiResponse{
  data: PackEngagement[];
}
export  interface AssessmentEngagementResponse extends  CustomApiResponse{
  data: AssessmentEngagement[];
}

export interface DashboardRequest {
  type: DashboardRangeFilterEnum;
  start: string;
  end: string;
}
