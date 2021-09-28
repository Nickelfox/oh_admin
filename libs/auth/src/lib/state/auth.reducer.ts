import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { Auth } from '../models/auth.interfaces';

export const AUTH_FEATURE_KEY = 'AUTH';

export interface AuthState {
  readonly [AUTH_FEATURE_KEY]: Auth;
}

export const authInitialState: Auth = {
  // set initial required properties
  loggedIn: false,
  token: '',
  isLoading: false,
  admin: {
    email: '',
    language: '',
    name: '',
    role: '',
    username: '',
    updated_at: '',
    id: 0,
    password: '',
    created_at: ''
  }
};

const reducer = createReducer(
    authInitialState,
    on(AuthActions.login, (state, _) => ({
      ...state,
      loggedIn: false,
      isLoading: true
    })),
    on(AuthActions.loginSuccess, (state, { token, admin }) => ({
      ...state,
      token,
      loggedIn: true,
      isLoading: false,
      admin
    })),
    on(AuthActions.loginFail, (state) => ({
      ...state,
      loggedIn: false,
      isLoading: false
    })),
    on(AuthActions.logoutLocal, (state, _) => ({
      ...state,
      loggedIn: false,
      isLoading: false,
      token: '',
      admin: {
        email: '',
        language: '',
        name: '',
        role: '',
        username: '',
        updated_at: '',
        id: 0,
        password: '',
        created_at: ''
      }
    })),
    on(AuthActions.checkLogin, (state, _) => ({
      ...state,
      loggedIn: false,
      isLoading: true
    })),
    on(AuthActions.checkLoginSuccess, (state, { token, admin }) => ({
      ...state,
      token,
      admin,
      loggedIn: true,
      isLoading: false
    })),
    on(AuthActions.checkLoginFail, (state) => ({
      ...state,
      loggedIn: false,
      isLoading: false
    })),
    on(AuthActions.adminUpdate, (state, admin) => ({
      ...state,
      admin
    }))
  )
;

export function authReducer(state: Auth | undefined, action: Action) {
  return reducer(state, action);
}
