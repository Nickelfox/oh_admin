import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  USER_LISTING_FEATURE_KEY,
  State,
  userListingAdapter,
} from './user-listing.reducer';

// Lookup the 'UserListing' feature state managed by NgRx
export const getUserListingState = createFeatureSelector<State>(
  USER_LISTING_FEATURE_KEY
);

const { selectAll, selectEntities } = userListingAdapter.getSelectors();

export const getUserListingLoaded = createSelector(
  getUserListingState,
  (state: State) => state.loaded
);

export const getUserListingError = createSelector(
  getUserListingState,
  (state: State) => state.error
);

export const getAllUserListing = createSelector(
  getUserListingState,
  (state: State) => selectAll(state)
);

export const getUserListingEntities = createSelector(
  getUserListingState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getUserListingState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getUserListingEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
