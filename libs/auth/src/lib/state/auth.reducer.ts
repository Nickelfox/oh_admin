import {Action, createReducer, on} from '@ngrx/store';

import * as AuthActions from './auth.actions';
import {Auth} from "../models/auth.interfaces";

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: Auth;
}

export const authInitialState: Auth = {
  // set initial required properties
  loggedIn: false,
  token: '',
  isLoading: false,
};

const reducer = createReducer(
    authInitialState,
    on(AuthActions.login, (state, _) => ({...state, isLoading: true})),
    on(AuthActions.loginSuccess, (state, {message, token}) => ({
      ...state,
      token,
      isLoading: false,
      loggedIn: true,
      message,
    })),
    on(AuthActions.loginFail, (state, {message}) => ({
      ...state,
      message,
      isLoading: false,
      loggedIn: false,
    })),
    on(AuthActions.logout, (state, _) => ({
      ...state,
      message: '',
      isLoading: false,
      loggedIn: false,
      token: ''
    })),
    on(AuthActions.checkLogin, (state, _) => ({
      ...state,
    })),
    on(AuthActions.checkLoginSuccess, (state, {token, message}) => ({
      ...state,
      loggedIn: true,
      token,
      message
    })),
    on(AuthActions.checkLoginFail, (state, {message}) => ({
      ...state,
      loggedIn: false,
      message,
    }))
  )
;

export function authReducer(state: Auth | undefined, action: Action) {
  return reducer(state, action);
}
