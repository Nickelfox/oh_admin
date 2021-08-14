import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Auth } from './auth.models';
import { AUTH_FEATURE_KEY} from './auth.reducer';

// Lookup the 'Auth' feature state managed by NgRx
export const getAuthState = createFeatureSelector<Auth>(AUTH_FEATURE_KEY);

export const getLoggedIn = createSelector(getAuthState, (auth: Auth) => auth.loggedIn);
export const getToken = createSelector(getAuthState, (auth: Auth) => auth.token);

export const authQuery = {
  getAuthState,
  getLoggedIn,
  getToken
}