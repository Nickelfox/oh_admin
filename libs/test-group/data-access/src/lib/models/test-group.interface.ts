import { CustomApiResponse, OrderedContent, SortingEnum, TagCategoryEnum } from '@hidden-innovation/shared/models';
import { Media } from '@hidden-innovation/media';
import { Test } from '@hidden-innovation/test/data-access';
import { Tag } from '@hidden-innovation/tags/data-access';

export interface TestGroupCore {
  name: string;
  category: TagCategoryEnum | 'NONE';
  subCategory: string | Tag;
  thumbnailId: number | undefined;
  imageId: number | undefined;
  description: string;
  isVisible: boolean;
  tests: Test[] | OrderedContent[] | number[];
}

export interface TestGroup extends TestGroupCore {
  id: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  category: TagCategoryEnum;
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

export interface CreateTestGroupResponse extends CustomApiResponse {
  data: {
    testGroup: TestGroup;
  }
}

export interface TestGroupDetailsResponse extends CustomApiResponse {
  data: TestGroup;
}

export interface TestGroupPublishToggleRequest {
  newState: boolean;
  id: number;
}

export interface TestGroupDeleteRequest extends TestGroupListingFilters {
  id: number;
  pageIndex: number;
  pageSize: number;
}
