import { CustomApiResponse, QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { AnswerCore, ImageSelectAnswer, MultipleChoiceAnswer } from './answer.interface';

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
  questionnaire: Questionnaire[];
  count: number;
}

export interface CreateQuestionnaireResponse extends CustomApiResponse {
  data: Questionnaire;
}
