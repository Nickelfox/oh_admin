import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import * as fromDashboard from './data-access/state/dashboard.reducer';
import {DashboardEffects} from './data-access/state/dashboard.effects';
import {DashboardFacade} from './data-access/state/dashboard.facade';
import {RouterModule} from "@angular/router";
import {DashboardComponent} from './dashboard.component';
import { MaterialModule } from '@hidden-innovation/material';



// import {AuthGuard} from "@hidden-innovation/auth";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        // canActivate: [AuthGuard],
        component: DashboardComponent
      }
    ]),
    StoreModule.forFeature(
      fromDashboard.DASHBOARD_FEATURE_KEY,
      fromDashboard.reducer
    ),
    EffectsModule.forFeature([DashboardEffects]),
    MaterialModule
  ],
  providers: [DashboardFacade, DashboardEffects],
})
export class DashboardModule {
}
