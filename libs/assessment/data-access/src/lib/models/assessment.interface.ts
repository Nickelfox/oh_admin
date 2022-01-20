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
  whyAreWeAskingQuestion:string
  whatYouWillGetOutOfIt: string;
  whatYouWillNeed: string;
  howItWorks: string;
  lockout: number;
  imageId:number;
  singleTestIds: number[];
  testGroupIds: number[];
  questionnaireIds: number[];
}

export interface Assessment extends AssessmentCore {
  id: number;
  category: TagCategoryEnum;
  // tests: number;
  image:Media;
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
