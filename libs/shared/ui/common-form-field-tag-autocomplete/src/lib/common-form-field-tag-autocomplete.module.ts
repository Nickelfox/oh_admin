import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldTagAutocompleteComponent } from './common-form-field-tag-autocomplete.component';
import { MaterialModule } from '@hidden-innovation/material';
import { TagsDataAccessModule } from '@hidden-innovation/tags/data-access';
import { UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TagsDataAccessModule,
    UtilsModule
  ],
  declarations: [
    CommonFormFieldTagAutocompleteComponent
  ],
  exports: [
    CommonFormFieldTagAutocompleteComponent
  ]
})
export class CommonFormFieldTagAutocompleteModule {}
