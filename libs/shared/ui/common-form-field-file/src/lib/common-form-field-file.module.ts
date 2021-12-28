import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldFileComponent } from './common-form-field-file.component';
import { MediaModule } from '@hidden-innovation/media';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [
    CommonModule,
    MediaModule,
    MaterialModule,
    UtilsModule
  ],
  declarations: [
    CommonFormFieldFileComponent
  ],
  exports: [
    CommonFormFieldFileComponent
  ]
})
export class CommonFormFieldFileModule {}
