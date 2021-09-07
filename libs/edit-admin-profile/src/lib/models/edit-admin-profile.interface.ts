/**
 * Interface for the 'Edit admin Profile' data
 */
import { CustomApiResponse } from '@hidden-innovation/shared/models';
import { AdminAuthDetails } from '@hidden-innovation/auth';

export interface EditAdminProfileRequest {
  name: string;
  username: string;
}

export interface EditAdminProfileResponse extends CustomApiResponse {
  data: AdminAuthDetails;
}
