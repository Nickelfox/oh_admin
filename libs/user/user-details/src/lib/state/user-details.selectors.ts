import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USER_DETAILS_FEATURE_KEY } from './user-details.reducer';
import { UserDetailsStateModel } from '../models/user-details.interface';

export const getUserDetailsState = createFeatureSelector<UserDetailsStateModel>(USER_DETAILS_FEATURE_KEY);

export const isLoading = createSelector(getUserDetailsState, (state: UserDetailsStateModel) => !!state.isLoading)
