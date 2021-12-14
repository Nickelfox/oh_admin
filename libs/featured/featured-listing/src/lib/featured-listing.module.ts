import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedListingComponent } from './featured-listing.component';
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
        component: FeaturedListingComponent
      }
    ]),
    MaterialModule,
    CommonDataFieldStatusModule,
    UtilsModule
  ],
  declarations: [
    FeaturedListingComponent
  ],
})
export class FeaturedListingModule {}
