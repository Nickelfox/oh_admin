import { createAction, props } from '@ngrx/store';
import { UserListingEntity } from '../models/user-listing.interface';

export const init = createAction('[UserListing Page] Init');

export const loadUserListingSuccess = createAction(
  '[UserListing/API] Load UserListing Success',
  props<{ userListing: UserListingEntity[] }>()
);

export const loadUserListingFailure = createAction(
  '[UserListing/API] Load UserListing Failure',
  props<{ error: any }>()
);
