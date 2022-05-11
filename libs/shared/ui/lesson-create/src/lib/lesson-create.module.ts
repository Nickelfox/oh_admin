import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonCreateComponent } from './lesson-create.component';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { FormFieldErrorsModule } from '@hidden-innovation/shared/ui/form-field-errors';
import { CommonFormFieldTagAutocompleteModule } from '@hidden-innovation/shared/ui/common-form-field-tag-autocomplete';
import { CommonFormFieldVideoModule } from '@hidden-innovation/shared/ui/common-form-field-video';
import { CommonFormFieldImageModule } from '@hidden-innovation/shared/ui/common-form-field-image';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormFieldErrorsModule,
    CommonFormFieldTagAutocompleteModule,
    CommonFormFieldVideoModule,
    CommonFormFieldImageModule,
    UtilsModule,
    CommonFormFieldModule
  ],
  declarations: [
    LessonCreateComponent
  ]

})
export class LessonCreateModule {
}
