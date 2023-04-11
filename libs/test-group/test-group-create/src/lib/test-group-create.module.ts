import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestGroupCreateComponent } from './test-group-create.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { RouterModule } from '@angular/router';
import { TestDataAccessModule } from '@hidden-innovation/test/data-access';
import { TestGroupDataAccessModule } from '@hidden-innovation/test-group/data-access';
import { FormFieldErrorsModule } from '@hidden-innovation/shared/ui/form-field-errors';
import { CommonFormFieldTextareaModule } from '@hidden-innovation/shared/ui/common-form-field-textarea';
import { CommonFormFieldImageModule } from '@hidden-innovation/shared/ui/common-form-field-image';
import { TagsDataAccessModule } from '@hidden-innovation/tags/data-access';
import { CommonFormFieldVideoModule } from '@hidden-innovation/shared/ui/common-form-field-video';
import { CommonFormFieldTagAutocompleteModule } from '@hidden-innovation/shared/ui/common-form-field-tag-autocomplete';
import {CommonFormFieldFileModule} from "@hidden-innovation/shared/ui/common-form-field-file";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    UtilsModule,
    TestDataAccessModule,
    TestGroupDataAccessModule,
    FormFieldErrorsModule,
    CommonFormFieldTextareaModule,
    CommonFormFieldImageModule,
    CommonFormFieldVideoModule,
    CommonFormFieldTagAutocompleteModule,
    CommonFormFieldFileModule,
    TagsDataAccessModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: TestGroupCreateComponent
      }
    ])
  ],
  declarations: [
    TestGroupCreateComponent
  ]
})
export class TestGroupCreateModule {
}
