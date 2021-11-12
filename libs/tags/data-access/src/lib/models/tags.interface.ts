import { CategoryEnum, CustomApiResponse, TagType } from '@hidden-innovation/shared/models';

export interface TagCore {
  name: string;
  tagType: TagType;
  categoryName: CategoryEnum;
}

export interface Tag extends TagCore {
  id: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

export interface TagsListingRequest {
  limit: number;
  page: number;
}

export interface TagsListingResponse extends CustomApiResponse {
  data: {
    tags: Tag[];
    total: number;
  };
}
