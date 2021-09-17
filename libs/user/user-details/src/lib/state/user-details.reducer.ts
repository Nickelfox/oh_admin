import { Action, createReducer, on } from '@ngrx/store';

import * as UserDetailsActions from './user-details.actions';
import { UserDetailsStateModel } from '../models/user-details.interface';

export const USER_DETAILS_FEATURE_KEY = 'USER_DETAILS';

export interface UserDetailsState {
  readonly [USER_DETAILS_FEATURE_KEY]: UserDetailsStateModel;
}

export const userDetailsInitialState: UserDetailsStateModel = {
  id: 0,
  email: '',
  username: '',
  name: '',
  role: '',
  language: '',
  created_at: '',
  updated_at: '',
  isLoading: false
};

const userDetailsReducer = createReducer(
  userDetailsInitialState,
  on(UserDetailsActions.getUserDetails, (state) => ({
    ...state,
    isLoading: true
  })),
  on(UserDetailsActions.getUserDetailsSuccess, (state, {
    id,
    name,
    username,
    role,
    email,
    updated_at,
    language,
    created_at
  }) => ({
    ...state,
    id,
    name,
    username,
    role,
    email,
    updated_at,
    language,
    created_at,
    isLoading: false
  })),
  on(UserDetailsActions.getUserDetailsFail, (state) => ({
    ...state,
    isLoading: false
  }))
);

export function reducer(state: UserDetailsStateModel | undefined, action: Action) {
  return userDetailsReducer(state, action);
}
