import { CustomApiResponse } from '@hidden-innovation/shared/models';
import { UserDetails } from '@hidden-innovation/shared/models';

export interface Auth extends Partial<LoginResponseData> {
  loggedIn?: boolean;
  isLoading?: boolean;
}

export interface LoginResponseData {
  token: string;
  admin: UserDetails;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends CustomApiResponse {
  /**
   * Bearer token
   */
  data: LoginResponseData;
}
