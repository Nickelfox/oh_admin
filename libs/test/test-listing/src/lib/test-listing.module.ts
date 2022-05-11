import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestListingComponent } from './test-listing.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { TestTabGroupModule } from '@hidden-innovation/shared/ui/test-tab-group';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { TestDataAccessModule } from '@hidden-innovation/test/data-access';
import { SortingHeaderDateModule } from '@hidden-innovation/shared/ui/sorting-header-date';
import { SortingHeaderNameModule } from '@hidden-innovation/shared/ui/sorting-header-name';

@NgModule({
  imports: [
    CommonModule,
    TestDataAccessModule,
    MaterialModule,
    UtilsModule,
    CommonFormFieldModule,
    TestTabGroupModule,
    SortingHeaderDateModule,
    SortingHeaderNameModule,
    CommonDataFieldStatusModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: TestListingComponent,
      }
    ])
  ],
  declarations: [
    TestListingComponent
  ],
})
export class TestListingModule {}
