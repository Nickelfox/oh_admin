import {LocalStorageService} from "../services";
import {SettingsState} from "./settings.model";
import {createReducer, on} from "@ngrx/store";
import * as SettingsActions from './settings.actions';

export const SETTINGS_FEATURE_KEY = 'settings';

export const initialState: SettingsState = LocalStorageService.loadInitialState()?.settings ?? {};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.persistLoadState, (state, {loaded}) => ({
    ...state,
    loaded
  }))
);
