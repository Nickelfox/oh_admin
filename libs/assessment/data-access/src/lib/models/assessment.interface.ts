import {CustomApiResponse, TagCategoryEnum} from "@hidden-innovation/shared/models";
import {Media} from "@hidden-innovation/media";
import {Featured} from "@hidden-innovation/featured/data-access";


export  interface AssessmentLocalState {
  id?:number;
  category: TagCategoryEnum;
  test: number;
  worstCase: number;
  bestCase: number;
  lockout:number;
}


export interface AssessmentCore{
  about: string;
  name: string;
  whatYouWillGetOutOfIt: string;
  whatYouWillNeed: string;
  howItWorks: string;
  lockout: number;
  imageId:number;
  image:Media;
}

export interface Assessment extends AssessmentCore {
  id: number;
  // tests: number;
  bestCase:number;
  worstCase:number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}


export interface AssessmentResponse extends CustomApiResponse {
  data: AssessmentResponseData;
}

export interface AssessmentResponseData extends Featured {
  Assessment: Assessment[];
}

export interface AssessmentListingResponse extends CustomApiResponse {
  data: Assessment[];
}
