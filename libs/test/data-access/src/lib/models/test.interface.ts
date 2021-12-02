import {
  CustomApiResponse,
  DifficultyEnum,
  SortingEnum,
  TagCategoryEnum,
  TestInputTypeEnum
} from '@hidden-innovation/shared/models';
import { Media } from '@hidden-innovation/media';
import { Tag } from '@hidden-innovation/tags/data-access';

export interface TestCore {
  category: string;
  difficulty: string;
  inputType: string;
  name: string;
  poster?: any;
  thumbnail: Media;
  video: Media;
  reps: Reps;
  tags: Tag[];
  oneRMInputFields: OneRMInputField[];
  multipleChoiceInputFields: any[];
  // inputFields: InputField[];
  ratioVariable?: any;
}

export interface Test extends TestCore {
  id: number;
  isPublished: boolean;
  updated_at: string;
  created_at: string;
}

export interface OneRMInputField {
  pointType: string;
  point: number;
  low: number;
  high: number;
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
  deletedAt?: any;
  createdAt: Date;
  updatedAt?: any;
}
