import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { Auth } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: Auth;
}

export const authInitialState: Auth = {
  // set initial required properties
  loggedIn: false,
  token: '',
  session_id: '',
};

const authReducer = createReducer(
  authInitialState,
  on(AuthActions.login, (state, _) => ({ ...state, isLoading: true })),
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    loggedIn: true,
    token: action.token,
    isLoading: false
  })),
  on(AuthActions.loginFail, (state, action) => ({
    ...state,
    errorMessage: action.errorMessage,
    isLoading: false
  }))
);

export function reducer(state: Auth | undefined, action: Action) {
  return authReducer(state, action);
}
