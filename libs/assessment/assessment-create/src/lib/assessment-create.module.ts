import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentCreateComponent } from './assessment-create.component';
import {MaterialModule} from "@hidden-innovation/material";
import {CommonFormFieldModule} from "@hidden-innovation/shared/ui/common-form-field";
import {CommonFormFieldImageModule} from "@hidden-innovation/shared/ui/common-form-field-image";
import {UtilsModule} from "@hidden-innovation/shared/utils";
import {CommonFormFieldTextareaModule} from "@hidden-innovation/shared/ui/common-form-field-textarea";
import {CommonFormFieldVideoModule} from "@hidden-innovation/shared/ui/common-form-field-video";
import {FormFieldErrorsModule} from "@hidden-innovation/shared/ui/form-field-errors";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    CommonFormFieldImageModule,
    UtilsModule,
    CommonFormFieldTextareaModule,
    CommonFormFieldVideoModule,
    FormFieldErrorsModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: AssessmentCreateComponent
      }
    ]),
  ],
  declarations: [
    AssessmentCreateComponent
  ],
})
export class AssessmentCreateModule {}
