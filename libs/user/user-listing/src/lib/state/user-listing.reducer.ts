import { Action, createReducer, on } from '@ngrx/store';
import { UserListing } from '../models/user-listing.interface';
import * as UserListActions from './user-listing.actions';


export const USER_LISTING_FEATURE_KEY = 'USER_LISTING';

export interface UserListingState {
  readonly [USER_LISTING_FEATURE_KEY]: UserListing;
}

export const userListingInitialState: UserListing = {
  total: 0,
  users: [],
  isLoading: false
};

const userListingReducer = createReducer(
  userListingInitialState,
  on(UserListActions.getList, (state) => ({
    ...state,
    isLoading: true
  })),
  on(UserListActions.getListSuccess, (state, { users, total }) => ({
    ...state,
    isLoading: false,
    users,
    total
  })),
  on(UserListActions.getListFail, (state, { users, total }) => ({
    ...state,
    isLoading: false
  }))
);

export function reducer(state: UserListing | undefined, action: Action) {
  return userListingReducer(state, action);
}
