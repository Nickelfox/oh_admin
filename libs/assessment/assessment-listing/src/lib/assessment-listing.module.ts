import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentListingComponent } from './assessment-listing.component';
import {MaterialModule} from "@hidden-innovation/material";
import {UtilsModule} from "@hidden-innovation/shared/utils";
import {CommonFormFieldModule} from "@hidden-innovation/shared/ui/common-form-field";
import {CommonDataFieldStatusModule} from "@hidden-innovation/shared/ui/common-data-field-status";
import {RouterModule} from "@angular/router";
import {AssessmentDataAccessModule} from "@hidden-innovation/assessment/data-access";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule,
    CommonFormFieldModule,
    CommonDataFieldStatusModule,
    AssessmentDataAccessModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: AssessmentListingComponent,
      }
    ])
  ],
  declarations: [
    AssessmentListingComponent
  ],
})
export class AssessmentListingModule {}
