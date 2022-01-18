import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedListingComponent } from './featured-listing.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { FeaturedDataAccessModule} from "@hidden-innovation/featured/data-access";


@NgModule({
  imports: [
    CommonModule,
    FeaturedDataAccessModule,
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
