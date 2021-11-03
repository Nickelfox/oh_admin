import { QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { AnswerCore, ImageSelectAnswer, MultipleChoiceAnswer } from './answer.interface';

export interface Question {
  name: string; // req
  // Omitted in some question types
  description: string;
  questionType: QuestionTypeEnum; // req
  whyAreWeAsking: boolean;
  whyAreWeAskingQuestion: string;
  answers?: MultipleChoiceAnswer[] | AnswerCore[];
  imageAnswer?: ImageSelectAnswer[];
}

// Final Questionnaire Interface
export interface Questionnaire {
  name: string; // req
  isScoring: boolean;
  questions: Question[];
}
