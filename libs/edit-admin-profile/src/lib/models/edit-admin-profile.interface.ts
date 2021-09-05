/**
 * Interface for the 'Edit admin Profile' data
 */
import { CustomApiResponse } from '@hidden-innovation/shared/models';

export interface EditAdminProfileRequest {
  name: string;
  email: string;
}

export interface EditAdminProfileResponse extends CustomApiResponse {
  data: null;
}
