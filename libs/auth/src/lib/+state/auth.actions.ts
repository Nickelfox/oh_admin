import { createAction, props } from '@ngrx/store';
import { Auth } from './auth.models';

// TODO Implement proper user data handling

export const login = createAction('[auth] LOGIN', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[auth] LOGIN_SUCCESS', props<Auth>());
export const loginFail = createAction('[auth] LOGIN_FAIL', props<Partial<Auth>>());
