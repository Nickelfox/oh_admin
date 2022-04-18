import { CustomApiResponse, QuestionTypeEnum, SortingEnum } from '@hidden-innovation/shared/models';
import { AnswerCore, ImageSelectAnswer, ImageSelectAnswerExtended, MultipleChoiceAnswer } from './answer.interface';
import { Media } from '@hidden-innovation/media';

export interface Question {
  name: string; // req
  description: string;
  questionType: QuestionTypeEnum; // req
  whyAreWeAsking: boolean;
  whyAreWeAskingQuestion: string;
  showIcon: boolean;
  omitScoring: boolean;
  answer: MultipleChoiceAnswer[] | AnswerCore[];
  imageAnswer: ImageSelectAnswer[];
}

export interface QuestionExtended extends Question {
  imageAnswer: ImageSelectAnswerExtended[];
}

// Final Questionnaire Interface
export interface Questionnaire {
  name: string;
  whatYouWillGetOutOfIt: string;
  overview: string;
  isScoring: boolean;
  imageId: number | undefined;
  questions: Question[];

}

export interface QuestionnaireListingFilters {
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  active: "TRUE" | "FALSE" | undefined;
  scoring: "TRUE" | "FALSE" | undefined;
  search: string | undefined;
}

export interface QuestionnaireListingRequest extends QuestionnaireListingFilters {
  limit: number;
  page: number;
}


export interface QuestionnaireListingResponse extends CustomApiResponse {
  data: QuestionnaireListingResponseData;
}

export interface QuestionnaireListingResponseData {
  questionnaire: QuestionnaireExtended[];
  count: number;
}

export interface CreateQuestionnaireResponse extends CustomApiResponse {
  data: {
    questionnaire: QuestionnaireExtended;
  };
}

export interface QuestionnaireResponse extends CustomApiResponse {
  data: {
    questionnaire: QuestionnaireExtended;
  };
}

export interface QuestionnaireExtended extends Questionnaire {
  questions: QuestionExtended[];
  image: Media;
  isActive: boolean;
  id: number;
}

export interface UpdateQuestionnaireResponse extends CreateQuestionnaireResponse {
  data: {
    questionnaire: QuestionnaireExtended;
  };
}

export interface QuestionnaireActiveToggleRequest {
  newState: boolean;
  id: number;
}

export interface QuestionnaireDeleteRequest extends QuestionnaireListingFilters {
  id: number;
  pageIndex: number;
  pageSize: number;
}
