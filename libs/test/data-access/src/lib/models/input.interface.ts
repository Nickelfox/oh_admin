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

export interface OneRMField extends CoreInputField {
  low: number | undefined;
  high: number | undefined;
}

export interface MultipleChoiceField extends CoreInputField {
  answer: string;
}

export interface InputField extends CoreInputField {
  low: number | Date | undefined;
  high: number | Date | undefined;
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

export interface RelativeProfileObject {
  label: string;
  profileInput: ProfileInputEnum | undefined;
  unit: ProfileInputTypeUnitEnum | undefined;
  inputType: ProfileInputTypeEnum | undefined;
}
