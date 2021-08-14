import { createReducer, on, Action } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { Auth } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';


export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: Auth;
}

export const authInitialState: Auth = {
  // set initial required properties
  loggedIn: false,
  token: ''
};

const authReducer = createReducer(
  authInitialState,
  on(AuthActions.login, (state, _) => ({...state})),
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    loggedIn: true,
    token: action.token
  })),
  on(AuthActions.loginFail, (state, _) => ({
    ...state,
   })),
);

export function reducer(state: Auth | undefined, action: Action) {
  return authReducer(state, action);
}
