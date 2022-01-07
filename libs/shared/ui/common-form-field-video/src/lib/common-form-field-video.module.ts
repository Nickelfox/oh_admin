import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldVideoComponent } from './common-form-field-video.component';
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
    CommonFormFieldVideoComponent
  ],
  exports: [
    CommonFormFieldVideoComponent
  ]
})
export class CommonFormFieldVideoModule {}
