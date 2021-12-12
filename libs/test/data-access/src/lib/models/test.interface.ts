import {
  CustomApiResponse,
  DifficultyEnum,
  DistanceTypeEnum,
  SortingEnum,
  TagCategoryEnum,
  TestInputTypeEnum
} from '@hidden-innovation/shared/models';
import { Media } from '@hidden-innovation/media';
import { Tag } from '@hidden-innovation/tags/data-access';
import { InputInputField, MultipleChoiceField, OneRMInputField } from './input.interface';

export interface Test {
  category: TagCategoryEnum;
  difficulty: DifficultyEnum;
  name: string;
  poster: Media;
  thumbnail: Media;
  video: Media;
  reps: Reps;
  tags: Tag[];
  inputType: TestInputTypeEnum;
  oneRMInputFields: OneRMInputField[];
  multipleChoiceInputFields: any[];
  inputFields: InputInputField[];
  ratioVariable?: any;
  id: number;
  isPublished: boolean;
  updated_at: string;
  created_at: string;
}

export interface CreateTest {
  name: string;
  category: TagCategoryEnum | undefined;
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
  distanceUnit: DistanceTypeEnum | undefined;
  // OneRemType Start
  resultExplanation: string;
  oneRMInputFields: OneRMInputField[];
  reps: {
    oneRep: boolean;
    threeRep: boolean;
    fiveRep: boolean;
  }
  // OneRemType End
  // MultipleChoiceType Start
  multipleChoiceQuestion: string;
  multipleChoiceInputFields: MultipleChoiceField[];
  // MultipleChoiceType End
}

export interface TestListingFliters {
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  category: TagCategoryEnum[] | undefined;
  published: 'TRUE' | 'FALSE' | undefined;
  search: string | undefined;
  type: TestInputTypeEnum[] | undefined;
  level: DifficultyEnum[] | undefined;
}

export interface TestListingRequest extends TestListingFliters {
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

export interface Reps {
  id: number;
  oneRep: boolean;
  threeRep: boolean;
  fiveRep: boolean;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}
