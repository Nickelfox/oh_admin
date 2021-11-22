import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ImageCropperReq } from '../../models/media.interface';

@Component({
  selector: 'hidden-innovation-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropperComponent {

  // tslint:disable-next-line:no-any
  croppedImage: any = '';
  loading = false;

  imageBlob: File | undefined;

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    private hotToastService: HotToastService,
    private constantDataService: ConstantDataService,
    @Inject(MAT_DIALOG_DATA) public data: ImageCropperReq) {
    this.loading = true;
    if (data.file.size > this.constantDataService.FIZE_SIZE_DATA.limit) {
      this.dialogRef.close(null);
      this.hotToastService.error(this.constantDataService.FIZE_SIZE_DATA.limitMessage);
    } else {
      this.imageBlob = data.file;
    }
  }

  loadImageFailed(): void {
    this.loading = false;
    this.hotToastService.error('Image load failed! Please try a valid jpeg/jpg, png image.');
    this.dialogRef.close(null);
  }

  emitImage(): void {
    this.dialogRef.close(this.croppedImage);
  }

  loadedState(): void {
    this.loading = false;
  }

  imageCropped(e: ImageCroppedEvent): void {
    if (e.base64 != null) {
      this.croppedImage = e.base64;
    }
  }

  ratioParser(): number {
    switch (this.data.aspectRatio) {
      case 'cube':
        return 1 / 1;
        break;
      case 'wide':
        return 16 / 9;
        break;
      default:
        return 1 / 1;
        break;
    }
  }
}
