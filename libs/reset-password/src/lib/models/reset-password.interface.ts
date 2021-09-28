import {CustomApiResponse} from "@hidden-innovation/shared/models";

/**
 * Interface for the 'ResetPassword' data
 */
export interface ResetPasswordRequest {
  email: string;
  code: number;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse extends CustomApiResponse {
  data: null;
}
