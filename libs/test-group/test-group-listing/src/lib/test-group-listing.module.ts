import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestGroupListingComponent } from './test-group-listing.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { TestTabGroupModule } from '@hidden-innovation/shared/ui/test-tab-group';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule,
    CommonFormFieldModule,
    TestTabGroupModule,
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
