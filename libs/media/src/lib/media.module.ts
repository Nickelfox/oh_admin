import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { MaterialModule } from '@hidden-innovation/material';
import { MediaUploadService } from './services/media-upload.service';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    ImageCropperComponent,
    ImagePickerComponent,
  ],
  providers: [
    MediaUploadService
  ],
  exports: [
    ImageCropperComponent,
    ImagePickerComponent,
  ]
})
export class MediaModule {}
