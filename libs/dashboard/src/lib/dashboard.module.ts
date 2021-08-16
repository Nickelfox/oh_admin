import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import * as fromDashboard from './data-access/state/dashboard.reducer';
import {DashboardEffects} from './data-access/state/dashboard.effects';
import {DashboardFacade} from './data-access/state/dashboard.facade';
import {RouterModule} from "@angular/router";
import {DashboardComponent} from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent,
      }
    ]),
    StoreModule.forFeature(
      fromDashboard.DASHBOARD_FEATURE_KEY,
      fromDashboard.reducer
    ),
    EffectsModule.forFeature([DashboardEffects]),
  ],
  providers: [DashboardFacade],
})
export class DashboardModule {
}
