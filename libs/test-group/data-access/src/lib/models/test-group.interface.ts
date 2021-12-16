import { CustomApiResponse, SortingEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { Media } from '@hidden-innovation/media';
import { Test } from '@hidden-innovation/test/data-access';

export interface TestGroupCore {
  name: string;
  category: TagCategoryEnum;
  subCategory: string;
  thumbnailId: number;
  imageId: number;
  description: string;
  is_visible: boolean;
  tests: Test[];
}

export interface TestGroup extends TestGroupCore {
  id: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  thumbnail: Media;
  image: Media;
}

export interface TestGroupListingFilters {
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  category: TagCategoryEnum[] | undefined;
  search: string | undefined;
  published: 'TRUE' | 'FALSE' | undefined;
}

export interface TestGroupListingRequest extends TestGroupListingFilters {
  limit: number;
  page: number;
}

export interface TestGroupListingResponse extends CustomApiResponse {
  data: TestGroupListingResponseData;
}

export interface TestGroupListingResponseData {
  test_groups: TestGroup[];
  count: number;
}
