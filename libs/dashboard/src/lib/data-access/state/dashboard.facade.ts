import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as DashboardActions from './dashboard.actions';
import * as DashboardFeature from './dashboard.reducer';
import * as DashboardSelectors from './dashboard.selectors';

@Injectable()
export class DashboardFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(DashboardSelectors.getDashboardLoaded));
  allDashboard$ = this.store.pipe(select(DashboardSelectors.getAllDashboard));
  selectedDashboard$ = this.store.pipe(select(DashboardSelectors.getSelected));

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(DashboardActions.init());
  }
}
