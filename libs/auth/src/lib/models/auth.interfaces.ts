import {CustomApiResponse} from "@hidden-innovation/shared/models";

export interface Auth {
  loggedIn: boolean;
  token: string;
  message?: string;
  isLoading?: boolean;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends CustomApiResponse {
  /**
   * Bearer token
   */
  data: string;
}
