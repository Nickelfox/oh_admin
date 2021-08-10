import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import * as SettingsActions from './settings.actions';
import {tap, withLatestFrom} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {SettingsState} from "./settings.model";
import {LocalStorageService} from "../services";
import {getSettingsState} from "./settings.selectors";
import {SETTINGS_FEATURE_KEY} from "./settings.reducer";

@Injectable()
export class SettingsEffects {
  public persistSettings$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SettingsActions.persistLoadState),
        withLatestFrom(this.store.pipe(select(getSettingsState))),
        tap(([, settings]) => this.localStorageService.setItem(SETTINGS_FEATURE_KEY, settings))
      ),
    {dispatch: false}
  );

  constructor(
    private readonly actions$: Actions,
    private store: Store<SettingsState>,
    private localStorageService: LocalStorageService
  ) {
  }
}
