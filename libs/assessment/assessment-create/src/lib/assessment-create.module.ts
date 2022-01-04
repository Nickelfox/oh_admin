import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe, UpperCasePipe} from '@angular/common';
import { AssessmentCreateComponent } from './assessment-create.component';
import {MaterialModule} from "@hidden-innovation/material";
import {CommonFormFieldModule} from "@hidden-innovation/shared/ui/common-form-field";
import {CommonFormFieldImageModule} from "@hidden-innovation/shared/ui/common-form-field-image";
import {UtilsModule} from "@hidden-innovation/shared/utils";
import {CommonFormFieldTextareaModule} from "@hidden-innovation/shared/ui/common-form-field-textarea";
import {FormFieldErrorsModule} from "@hidden-innovation/shared/ui/form-field-errors";
import {RouterModule} from "@angular/router";
import {PackDataAccessModule} from "@hidden-innovation/pack/data-access";
import {CommonFormFieldFileModule} from "@hidden-innovation/shared/ui/common-form-field-file";
import {MediaModule} from "@hidden-innovation/media";
import {TagsDataAccessModule} from "@hidden-innovation/tags/data-access";
import {ContentSelectorModule} from "@hidden-innovation/shared/ui/content-selector";
import {PackContentCardModule} from "@hidden-innovation/shared/ui/pack-content-card";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    CommonFormFieldTextareaModule,
    CommonFormFieldImageModule,
    CommonFormFieldFileModule,
    MediaModule,
    TagsDataAccessModule,
    ContentSelectorModule,
    UtilsModule,
    PackDataAccessModule,
    FormFieldErrorsModule,
    PackContentCardModule,
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
  providers: [
    UpperCasePipe,
    TitleCasePipe
  ]
})
export class AssessmentCreateModule {}
