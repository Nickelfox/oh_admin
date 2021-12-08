import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldImageComponent } from './common-form-field-image.component';
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
    CommonFormFieldImageComponent
  ],
  exports: [
    CommonFormFieldImageComponent
  ]
})
export class CommonFormFieldImageModule {}
