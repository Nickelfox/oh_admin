import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USER_LISTING_FEATURE_KEY } from './user-listing.reducer';
import { UserListing } from '../models/user-listing.interface';

export const getUsersListState = createFeatureSelector<UserListing>(USER_LISTING_FEATURE_KEY);

export const getUsersList = createSelector(getUsersListState, (state: UserListing) => state.users);
export const getUsersCount = createSelector(getUsersListState, (state: UserListing) => state.total);

export const isLoading = createSelector(getUsersListState, (state: UserListing) => !!state.isLoading);
export const isLoaded = createSelector(getUsersListState, (state: UserListing) => !!state.loaded);
