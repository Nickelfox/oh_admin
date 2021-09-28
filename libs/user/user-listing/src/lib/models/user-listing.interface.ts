import { CustomApiResponse, UserDetails } from '@hidden-innovation/shared/models';

export interface UserListingRequest {
  limit: number;
  page: number;
}

export interface UserListingResponseData {
  users: UserDetails[];
  total: number;
}

export interface UserListingResponse extends CustomApiResponse {
  data: UserListingResponseData;
}

export interface UserListing extends Partial<UserListingResponseData> {
  isLoading?: boolean;
  loaded?: boolean;
}

export const PaginatorData = {
  pageIndex: 1,
  pageSizeOptions: [5, 10, 25, 100],
  pageSize: 10
}
