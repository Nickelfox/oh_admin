import { CustomApiResponse, SortingEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { TestListingFliters } from '@hidden-innovation/test/data-access';


export interface TestGroup {
  id: number;
  name: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  category: TagCategoryEnum;
  options: number;
  status: boolean;
}

export interface TestGroupListingFilters {
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  category: TagCategoryEnum[] | undefined;
  search: string | undefined;
  published: 'TRUE' | 'FALSE' | undefined;
}

export interface TestGroupListingRequest extends TestListingFliters {
  limit: number;
  page: number;
}

export interface TestGroupListingResponse extends CustomApiResponse {
  data: TestGroupListingResponseData;
}

export interface TestGroupListingResponseData {
  testGroup: TestGroup[];
  total: number;
}
