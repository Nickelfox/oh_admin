import { CustomApiResponse } from '@hidden-innovation/shared/models';

export interface Auth extends Partial<LoginResponseData> {
  loggedIn?: boolean;
  isLoading?: boolean;
}

export interface AdminAuthDetails {
  id: number;
  email: string;
  password: string;
  username: string;
  name: string;
  role: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponseData {
  token: string;
  admin: AdminAuthDetails;
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
