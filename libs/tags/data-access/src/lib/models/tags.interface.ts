import { CustomApiResponse, SortingEnum, TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';

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

export interface TagListingFilters {
  type: TagTypeEnum[] | undefined;
  category: TagCategoryEnum[] | undefined;
  dateSort: SortingEnum | undefined;
  nameSort: SortingEnum | undefined;
  search: string | undefined;
}

export interface TagsListingRequest extends TagListingFilters {
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

export interface CreateTagRequest extends TagsListingRequest {
  tag: TagCore;
}

export interface CreateTagResponse extends CustomApiResponse {
  data: {
    tag: Tag;
  };
}

export interface TagDeleteRequest extends TagsListingRequest {
  id: number;
}
