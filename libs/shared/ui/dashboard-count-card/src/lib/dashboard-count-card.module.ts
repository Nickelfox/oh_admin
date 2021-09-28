import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCountCardComponent } from './dashboard-count-card.component';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    DashboardCountCardComponent
  ],
  exports: [
    DashboardCountCardComponent
  ]
})
export class DashboardCountCardModule {}
