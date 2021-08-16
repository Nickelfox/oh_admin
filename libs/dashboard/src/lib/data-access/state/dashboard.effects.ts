import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as DashboardActions from './dashboard.actions';
import * as DashboardFeature from './dashboard.reducer';

@Injectable()
export class DashboardEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.init),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return DashboardActions.loadDashboardSuccess({ dashboard: [] });
        },
        onError: (action, error) => {
          console.error('Error', error);
          return DashboardActions.loadDashboardFailure({ error });
        },
      })
    )
  );

  constructor(private readonly actions$: Actions) {}
}
