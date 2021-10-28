import { QuestionTypeEnum } from '@hidden-innovation/shared/models';
import {
  ImageSelectAnswer,
  MultipleChoiceAnswer,
  SliderAnswer,
  VerticalSelectAnswer,
  YesNoChoiceAnswer
} from './answer.interface';

export interface Question {
  name: string; // req
  // Omitted in some question types
  description?: string;
  type: QuestionTypeEnum; // req
  reason: string;
  answers: any;
}

// Final Questionnaire Interface
export interface Questionnaire {
  name: string; // req
  questions: Question[];
}
