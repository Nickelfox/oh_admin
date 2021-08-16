import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import {Auth} from "../models";

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: Auth;
}

export const authInitialState: Auth = {
  // set initial required properties
  loggedIn: false,
  token: '',
  session_id: ''
};

const reducer = createReducer(
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
    })),
    on(AuthActions.checkLogin, (state, _) => ({
      ...state
    })),
    on(AuthActions.checkLoginSuccess, (state, action) => ({
      ...state,
      loggedIn: true,
      token: action.token,
      session_id: action.token
    })),
    on(AuthActions.checkLoginFail, (state, action) => ({
      ...state,
      loggedIn: false,
      token: '',
      session_id: ''
    }))
  )
;

export function authReducer(state: Auth | undefined, action: Action) {
  return reducer(state, action);
}
