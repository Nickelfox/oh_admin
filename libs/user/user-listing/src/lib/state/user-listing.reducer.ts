import { Action, createReducer, on } from '@ngrx/store';
import * as UserListActions from './user-listing.actions';
import { UserListing } from '../models/user-listing.interface';

export const USER_LISTING_FEATURE_KEY = 'USER_LISTING';

export interface UserListingState {
  readonly [USER_LISTING_FEATURE_KEY]: UserListing;
}

export const userListingInitialState: UserListing = {
  total: 0,
  users: [],
  isLoading: false,
  loaded: false
};

const userListingReducer = createReducer(
  userListingInitialState,
  on(UserListActions.getList, (state) => ({
    ...state,
    isLoading: true,
    loaded: false,
  })),
  on(UserListActions.getListSuccess, (state, { users, total }) => ({
    ...state,
    isLoading: false,
    loaded: true,
    users,
    total
  })),
  on(UserListActions.getListFail, (state) => ({
    ...state,
    isLoading: false,
    loaded: false,
  })),
  on(UserListActions.setListPage, (state) => ({
    ...state,
    isLoading: true
  }))
);

export function reducer(state: UserListing | undefined, action: Action) {
  return userListingReducer(state, action);
}
