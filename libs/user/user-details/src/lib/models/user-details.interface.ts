import { CustomApiResponse, UserDetails } from '@hidden-innovation/shared/models';

export interface UserDetailsResponse extends CustomApiResponse {
  data: UserDetails;
}
