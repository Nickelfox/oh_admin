import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '@hidden-innovation/material';
import { DashboardStore } from './dashboard.store';
import { DashboardService } from './services/dashboard.service';
import { DashboardCountCardModule } from '@hidden-innovation/shared/ui/dashboard-count-card';


// import {AuthGuard} from "@hidden-innovation/auth";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    DashboardCountCardModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        // canActivate: [AuthGuard],
        component: DashboardComponent
      }
    ])
  ],
  providers: [
    DashboardService,
    DashboardStore]
})
export class DashboardModule {
}
