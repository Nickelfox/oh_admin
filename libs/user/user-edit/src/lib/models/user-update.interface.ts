import { CustomApiResponse, UserDetails } from '@hidden-innovation/shared/models';

export interface UserUpdateRequest {
  username: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  skinColor: string;
  status: boolean;
}

export interface UserUpdateResponse extends CustomApiResponse {
  data: {
    user: UserDetails;
  };
}
