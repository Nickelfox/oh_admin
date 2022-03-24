import {
  CustomApiResponse,
  DifficultyEnum,
  DistanceTypeEnum, Reps, RepsCore,
  SortingEnum,
  TagCategoryEnum,
  TestInputTypeEnum,
  WeightTypeEnum
} from '@hidden-innovation/shared/models';
import { Media } from '@hidden-innovation/media';
import { Tag } from '@hidden-innovation/tags/data-access';
import {
  InputField,
  InputFieldExtended,
  MultipleChoiceField,
  MultipleChoiceFieldExtended,
  OneRMField,
  OneRMFieldExtended,
  RatioSubObject,
  RatioSubObjectExtended,
  RelativeProfileObject,
  RelativeProfileObjectExtended
} from './input.interface';

export interface Test {
  id: number;
  category: TagCategoryEnum;
  difficulty: DifficultyEnum;
  inputType: TestInputTypeEnum;
  name: string;
  isPublished: boolean;
  updated_at: string;
  created_at: string;
  label: string;
  poster: Media;
  thumbnail: Media;
  video: Media;
  reps: Reps;
  inverseScoresheet: boolean;
  tags: Tag[];
  needEquipment: boolean;
  equipment: string;
  outcomes: string;
  procedure: string;
  // DistanceType Start
  distanceUnit: DistanceTypeEnum | undefined;
  // DistanceType End  procedure: string;
  //Custom Numeric Start
  customNumericLabel: string;
  //Custom Numeric End
  // WeightType Start
  weightUnit: WeightTypeEnum | undefined;
  // WeightType End
  description: string;
  resultExplanation: string;
  oneRMInputFields: OneRMFieldExtended[];
  multipleChoiceInputFields: MultipleChoiceFieldExtended[];
  multipleChoiceQuestion: string;
  inputFields: InputFieldExtended[];
  //Ratio Start
  ratioVariable: RatioSubObjectExtended | undefined;
  //Ratio End
  relativeProfile: RelativeProfileObjectExtended | null;
}

export interface CreateTest {
  name: string;
  category: TagCategoryEnum | 'NONE';
  difficulty: DifficultyEnum;
  inputType: TestInputTypeEnum | 'NONE',
  needEquipment: boolean;
  equipment: string;
  description: string;
  label: string;
  outcomes: string;
  procedure: string;
  isPublished: boolean;
  thumbnailId: number | undefined;
  videoId: number | undefined;
  posterId: number | undefined;
  tags: number[];
  // OneRemType Start
  resultExplanation: string;
  inverseScoresheet: boolean;
  oneRMInputFields: OneRMField[];
  reps: RepsCore;
  // OneRemType End
  // MultipleChoiceType Start
  multipleChoiceQuestion: string;
  multipleChoiceInputFields: MultipleChoiceField[];
  // MultipleChoiceType End
  // DistanceType Start
  distanceUnit: DistanceTypeEnum | undefined;
  // DistanceType End

  // WeightType Start
  weightUnit: WeightTypeEnum | undefined;
  // WeightType End

  //Ratio Start
  ratioVariable: RatioSubObject | undefined;
  //Ratio End

  //Relative Profile Start
  relativeProfile: RelativeProfileObject | undefined;
  //Relative Profile End

  //Custom Numeric Start
  customNumericLabel: string;
  //Custom Numeric End

  // Common Input Field
  inputFields: InputField[];
}

export interface CreateTestResponse extends CustomApiResponse {
  data: {
    test: Test;
  };
}

export interface TestListingFilters {
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  category: (TagCategoryEnum | 'NONE')[] | undefined;
  published: 'TRUE' | 'FALSE' | undefined;
  search: string | undefined;
  type: TestInputTypeEnum[] | undefined;
  level: DifficultyEnum[] | undefined;
}

export interface TestListingRequest extends TestListingFilters {
  limit: number;
  page: number;
}

export interface TestListingResponse extends CustomApiResponse {
  data: TestListingResponseData;
}

export interface TestListingResponseData {
  tests: Test[];
  total: number;
}

export interface TestResponse extends CustomApiResponse {
  data: {
    test: Test;
  };
}

export interface TestPublishToggleRequest {
  newState: boolean;
  id: number;
}

export interface TestDeleteRequest extends TestListingFilters {
  id: number;
  pageIndex: number;
  pageSize: number;
}
