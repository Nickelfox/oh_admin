import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY} from './auth.reducer';
import {Auth} from "../models/auth.interfaces";

// Lookup the 'Auth' feature state managed by NgRx
export const getAuthState = createFeatureSelector<Auth>(AUTH_FEATURE_KEY);

export const getLoggedIn = createSelector(getAuthState, (auth: Auth) => auth.loggedIn);
export const getToken = createSelector(getAuthState, (auth: Auth) => auth.token);
export const getLoadingState = createSelector(getAuthState, (auth: Auth) => !!auth.isLoading);
