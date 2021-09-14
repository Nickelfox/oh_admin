import { createAction, props } from '@ngrx/store';
import { UserListing, UserListingRequest } from '../models/user-listing.interface';

export const getList = createAction('[UserListing/API] USER_LISTING', props<UserListingRequest>());
export const getListSuccess = createAction('[UserListing] USER_LISTING_SUCCESS', props<UserListing>());
export const getListFail = createAction('[UserListing] USER_LISTING_FAIL', props<Partial<UserListing>>());
