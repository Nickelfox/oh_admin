import { CustomApiResponse, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { Media } from '@hidden-innovation/media';
import { Test } from '@hidden-innovation/test/data-access';
import { QuestionnaireExtended } from '@hidden-innovation/questionnaire/data-access';
import { ContentCore } from '@hidden-innovation/pack/data-access';

export interface AssessmentListState {
  category: TagCategoryEnum;
  count: number;
  worstCase: number;
  bestCase: number;
  lockout: number;
}

export interface AssessmentCore {
  about: string | undefined;
  name: string | undefined;
  category: TagCategoryEnum | undefined
  whatYouWillGetOutOfIt: string | undefined;
  whatYouWillNeed: string | undefined;
  howItWorks: string | undefined;
  lockout: number | undefined;
  imageId: number | undefined;
  singleTestIds: number[];
  // testGroupIds: number[];
  questionnaireIds: number[];
  content: ContentCore[];
}

export interface Assessment extends AssessmentCore {
  id: number;
  // tests: number;
  image: Media;
  tests: Test[];
  questionnaires: QuestionnaireExtended[];
  bestCase: number;
  worstCase: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResponse extends CustomApiResponse {
  data: {
    assessment: AssessmentResponseData;
  };
}

export interface AssessmentResponseData extends Assessment {
  assessment: Assessment[];
}

export interface AssessmentListingResponse extends CustomApiResponse {
  data: Assessment[];
}

export interface AssessmentUpdateResponse extends CustomApiResponse {
  data: Assessment;
}
