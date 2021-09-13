/**
 * Interface for the 'Edit admin Profile' data
 */
import { CustomApiResponse, UserDetails } from '@hidden-innovation/shared/models';

export interface EditAdminProfileRequest {
  name: string;
  username: string;
}

export interface EditAdminProfileResponse extends CustomApiResponse {
  data: UserDetails;
}
