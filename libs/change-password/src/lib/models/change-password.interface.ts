/**
 * Interface for the 'ChangePassword' data
 */
import {CustomApiResponse} from "@hidden-innovation/shared/models";

export interface ChangePasswordRequest {
  password: string;
  passwordNew: string;
  passwordConfirm: string;
}

export interface ChangePasswordResponse extends CustomApiResponse {
  data: null;
}
