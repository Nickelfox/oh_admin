import {CustomApiResponse} from "@hidden-innovation/shared/models";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse extends CustomApiResponse {
  data: null;
}
