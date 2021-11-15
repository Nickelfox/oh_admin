import { TagCategoryEnum, CustomApiResponse, TagTypeEnum } from '@hidden-innovation/shared/models';

export interface TagCore {
  name: string;
  tagType: TagTypeEnum;
  categoryName: TagCategoryEnum | null;
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

export interface TagDialogReq {
  isNew: boolean;
  tagType: TagTypeEnum;
  tag?: Tag;
}

export interface CreateTagRequest {
  tag: TagCore;
  pageIndex: number;
  pageSize: number;
}

export interface CreateTagResponse extends CustomApiResponse {
  data: {
    tag: Tag;
  };
}
