import { createAction, props } from '@ngrx/store';
import { DashboardEntity } from './dashboard.models';

export const init = createAction('[Dashboard Page] Init');

export const loadDashboardSuccess = createAction(
  '[Dashboard/API] Load Dashboard Success',
  props<{ dashboard: DashboardEntity[] }>()
);

export const loadDashboardFailure = createAction(
  '[Dashboard/API] Load Dashboard Failure',
  props<{ error: any }>()
);
