import {Action, createAction, props} from '@ngrx/store';
import {Auth, LoginRequest} from "../models";

// TODO Implement proper user data handling

export const login = createAction('[auth/API] LOGIN', props<LoginRequest>());
export const loginSuccess = createAction('[auth] LOGIN_SUCCESS', props<Auth>());
export const loginFail = createAction('[auth] LOGIN_FAIL', props<Partial<Auth>>());

export const checkLogin = createAction('[auth] CHECK_LOGIN_STATUS');
export const checkLoginSuccess = createAction('[auth] CHECK_LOGIN_SUCCESS', props<Auth>());
export const checkLoginFail = createAction('[auth] CHECK_LOGIN_FAIL', props<Partial<Auth>>());

