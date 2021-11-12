import { CustomApiResponse, QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { AnswerCore, ImageSelectAnswer, ImageSelectAnswerExtended, MultipleChoiceAnswer } from './answer.interface';

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
  name: string; // req
  isScoring: boolean;
  questions: Question[];
}

export interface QuestionnaireListingRequest {
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

export interface QuestionnaireDeleteRequest {
  id: number;
  pageIndex: number;
  pageSize: number;
}
