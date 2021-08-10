import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as SettingsActions from './settings.actions';
import * as SettingsSelectors from './settings.selectors';
import {SettingsState} from "./settings.model";

@Injectable()
export class SettingsFacade {
  public settings$ = this.store.select(SettingsSelectors.getSettingsState);
  public loaded$ = this.store.select(SettingsSelectors.getSettingsLoadState);

  constructor(private store: Store<SettingsState>) {
  }

  public persistLoad(loaded: boolean) {
    this.store.dispatch(SettingsActions.persistLoadState({loaded}));
  }
}
