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
import {AssessmentDataAccessModule} from "@hidden-innovation/assessment/data-access";
import { TestDataAccessModule } from '@hidden-innovation/test/data-access';
import { QuestionnaireDataAccessModule } from '@hidden-innovation/questionnaire/data-access';
import {CommonFormFieldNumberModule} from "@hidden-innovation/shared/ui/common-form-field-number";
import {TestGroupDataAccessModule} from "@hidden-innovation/test-group/data-access";

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CommonFormFieldModule,
        CommonFormFieldTextareaModule,
        CommonFormFieldImageModule,
        CommonFormFieldFileModule,
        MediaModule,
        TestDataAccessModule,
      TestGroupDataAccessModule,
        QuestionnaireDataAccessModule,
        PackContentCardModule,
        UtilsModule,
        FormFieldErrorsModule,
        AssessmentDataAccessModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: AssessmentCreateComponent
            }
        ]),
        CommonFormFieldNumberModule,
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
