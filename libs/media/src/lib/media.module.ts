import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { MaterialModule } from '@hidden-innovation/material';
import { MediaService } from './services/media.service';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { VideoPickerComponent } from './components/video-picker/video-picker.component';
import { FilePickerComponent } from './components/file-picker/file-picker.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    ImageCropperComponent,
    ImagePickerComponent,
    VideoPickerComponent,
    FilePickerComponent,
  ],
  providers: [
    MediaService
  ],
  exports: [
    ImageCropperComponent,
    ImagePickerComponent,
    VideoPickerComponent,
    FilePickerComponent
  ]
})
export class MediaModule {}
