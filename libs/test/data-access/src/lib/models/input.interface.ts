import {
  DistanceTypeEnum,
  PointTypeEnum,
  ProfileInputEnum,
  ProfileInputTypeEnum,
  ProfileInputTypeUnitEnum,
  RatioTestTypeEnum,
  WeightTypeEnum
} from '@hidden-innovation/shared/models';

export interface CoreInputField {
  pointType: PointTypeEnum;
  point: number;
}

interface CommonInputFieldResponse {
  id: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
  testId: number;
}

export interface OneRMField extends CoreInputField {
  low: number | undefined;
  high: number | undefined;
}

export interface OneRMFieldExtended extends OneRMField, CommonInputFieldResponse {
}

export interface MultipleChoiceField extends CoreInputField {
  answer: string;
}

export interface MultipleChoiceFieldExtended extends MultipleChoiceField, CommonInputFieldResponse {
}

export interface InputField extends CoreInputField {
  low: number | Date | undefined | string;
  high: number | Date | undefined | string;
}

export interface InputFieldExtended extends InputField, CommonInputFieldResponse {
}

export interface RatioSubObject {
  xType: RatioTestTypeEnum | undefined;
  yType: RatioTestTypeEnum | undefined;
  xDistanceUnit: DistanceTypeEnum | undefined;
  yDistanceUnit: DistanceTypeEnum | undefined;
  xWeightUnit: WeightTypeEnum | undefined;
  yWeightUnit: WeightTypeEnum | undefined;
  xLabel: string;
  yLabel: string;
}

export interface RatioSubObjectExtended extends  RatioSubObject {
  id: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RelativeProfileObject {
  label: string;
  profileInput: ProfileInputEnum | undefined;
  unit: ProfileInputTypeUnitEnum | undefined;
  inputType: ProfileInputTypeEnum | undefined;
}

export interface RelativeProfileObjectExtended extends RelativeProfileObject {
  id: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}
