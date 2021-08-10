import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SETTINGS_FEATURE_KEY, } from './settings.reducer';
import {SettingsState} from "./settings.model";

// Lookup the 'Settings' feature store managed by NgRx
export const getSettingsState =
  createFeatureSelector<SettingsState>(SETTINGS_FEATURE_KEY);

export const getSettingsUserID = createSelector(
  getSettingsState,
  (state: SettingsState) => state.userId
);

export const getSettingsLoadState = createSelector(
  getSettingsState,
  (state: SettingsState) => state.load
);
