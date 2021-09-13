import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as UserListingActions from './user-listing.actions';
import { UserListingEntity } from '../models/user-listing.interface';

export const USER_LISTING_FEATURE_KEY = 'userListing';

export interface State extends EntityState<UserListingEntity> {
  selectedId?: string | number; // which UserListing record has been selected
  loaded: boolean; // has the UserListing list been loaded
  error?: string | null; // last known error (if any)
}

export interface UserListingPartialState {
  readonly [USER_LISTING_FEATURE_KEY]: State;
}

export const userListingAdapter: EntityAdapter<UserListingEntity> =
  createEntityAdapter<UserListingEntity>();

export const initialState: State = userListingAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const userListingReducer = createReducer(
  initialState,
  on(UserListingActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(UserListingActions.loadUserListingSuccess, (state, { userListing }) =>
    userListingAdapter.setAll(userListing, { ...state, loaded: true })
  ),
  on(UserListingActions.loadUserListingFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return userListingReducer(state, action);
}
