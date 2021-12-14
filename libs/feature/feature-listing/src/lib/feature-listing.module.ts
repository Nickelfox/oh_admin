import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureListingComponent } from './feature-listing.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: FeatureListingComponent
      }
    ]),
    MaterialModule,
    CommonDataFieldStatusModule,
    UtilsModule
  ],
  declarations: [
    FeatureListingComponent
  ],
})
export class FeatureListingModule {}
