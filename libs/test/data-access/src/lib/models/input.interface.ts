import { PointTypeEnum } from '@hidden-innovation/shared/models';

export interface CoreInputField {
  pointType: PointTypeEnum;
  point: number | string;
}

export interface OneRMInputField extends CoreInputField {
  low: number | undefined;
  high: number | undefined;
}

export interface MultipleChoiceField extends CoreInputField {
  answer: string;
}

export interface InputInputFieldCore {
  pointType: string;
  point: number;
  low: number;
  high: number;
}

export interface InputInputField extends InputInputFieldCore {
  id: number;
  testId: number;
}
