import { PointTypeEnum } from '@hidden-innovation/shared/models';

export interface CoreInputField {
  pointType: PointTypeEnum;
  point: number | string;
}

export interface OneRMField extends CoreInputField {
  low: number | undefined;
  high: number | undefined;
}

export interface MultipleChoiceField extends CoreInputField {
  answer: string;
}

export interface InputField extends CoreInputField {
  low: number | undefined;
  high: number | undefined;
}
