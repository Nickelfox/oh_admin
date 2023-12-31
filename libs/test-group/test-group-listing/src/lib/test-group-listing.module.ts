import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestGroupListingComponent } from './test-group-listing.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { TestTabGroupModule } from '@hidden-innovation/shared/ui/test-tab-group';
import { RouterModule } from '@angular/router';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { TestGroupDataAccessModule } from '@hidden-innovation/test-group/data-access';
import { SortingHeaderNameModule } from '@hidden-innovation/shared/ui/sorting-header-name';
import { SortingHeaderDateModule } from '@hidden-innovation/shared/ui/sorting-header-date';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule,
    CommonFormFieldModule,
    CommonDataFieldStatusModule,
    TestTabGroupModule,
    SortingHeaderNameModule,
    SortingHeaderDateModule,
    TestGroupDataAccessModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: TestGroupListingComponent
      }
    ])
  ],
  declarations: [
    TestGroupListingComponent
  ]
})
export class TestGroupListingModule {
}
