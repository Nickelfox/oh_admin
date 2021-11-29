import {
  CustomApiResponse,
  DifficultyEnum,
  SortingEnum,
  TagCategoryEnum,
  TestInputTypeEnum
} from '@hidden-innovation/shared/models';

export interface TestCore {
  id: number;
  name: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  category: TagCategoryEnum;
  difficulty: DifficultyEnum;
  input: TestInputTypeEnum;
  status: boolean;
}

export interface TestListingFliters {
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  category: TagCategoryEnum[] | undefined;
  published: 'TRUE' | 'FALSE' | undefined;
  search: string | undefined;
}

export interface TestListingRequest extends TestListingFliters {
  limit: number;
  page: number;
}

export interface TestListingResponse extends CustomApiResponse {
  data: TestListingResponseData;
}

export interface TestListingResponseData {
  tests: TestCore[];
  total: number;
}
