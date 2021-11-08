import { CustomApiResponse, UserDetails } from '@hidden-innovation/shared/models';

export interface UserListingRequest {
  limit: number;
  page: number;
  name: string;
}

export interface UserListingResponseData {
  users: UserDetails[];
  total: number;
}

export interface UserListingResponse extends CustomApiResponse {
  data: UserListingResponseData;
}

export const UserPaginatorData = {
  pageIndex: 1,
  pageSizeOptions: [5, 10, 25, 100],
  pageSize: 10
};

export interface UserDetailsResponse extends CustomApiResponse {
  data: UserDetails;
}

export interface UserBlockRequest {
  data: {
    is_blocked: boolean;
  };
  id: number;
}

export interface UserDetailsResponse extends CustomApiResponse {
  data: UserDetails;
}

export interface UserBlockRequest {
  data: {
    is_blocked: boolean;
  };
  id: number;
}

export interface UserBlockResponse extends CustomApiResponse {
  data: {
    user: UserDetails;
  };
}
