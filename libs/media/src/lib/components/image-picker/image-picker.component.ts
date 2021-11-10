import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ImageCropperReq, ImageCropperResponseData } from '../../models/media.interface';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { base64ToFile } from 'ngx-image-cropper';
import { MatDialog } from '@angular/material/dialog';
import { MediaUploadService } from '../../services/media-upload.service';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { filter, switchMap } from 'rxjs/operators';
import { AuthFacade } from '@hidden-innovation/auth';

@Component({
  selector: 'hidden-innovation-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePickerComponent {

  isUploading = false;
  toastRef: CreateHotToastRef<unknown> | undefined;

  @Input() isInvalid = false;

  @Output() imageUploadRes: EventEmitter<ImageCropperResponseData> = new EventEmitter<ImageCropperResponseData>();

  constructor(
    private matDialog: MatDialog,
    private mediaUploadService: MediaUploadService,
    private hotToastService: HotToastService,
    private cdr: ChangeDetectorRef,
    private authFacade: AuthFacade
  ) {
  }

  openImageCropper(
    // tslint:disable-next-line:no-any
    $event: any,
    coverPicker: HTMLInputElement
  ): void {
    if ($event.target.files && $event.target.files[0]) {
      const [file] = $event.target.files;
      const reader = new FileReader();
      reader.readAsDataURL($event.target.files[0]);
      reader.onloadstart = ev => {
        this.toastRef = this.hotToastService.loading('Loading Image...');
      };
      reader.onload = (e: any) => {
        const cropperObj: ImageCropperReq = {
          file: file,
          aspectRatio: 'cube',
          round: false
        };
        const dialogRef = this.matDialog.open(ImageCropperComponent, {
          data: cropperObj
        });
        dialogRef.afterClosed().subscribe((cropperResult: any) => {
          if (cropperResult) {
            coverPicker.value = '';
            this.upload(base64ToFile(cropperResult), cropperResult, file.name);
          }
        });
      };
      reader.onloadend = _ => {
        this.toastRef?.close();
      };
      reader.onerror = _ => {
        this.toastRef?.updateToast({
          type: 'error',
          dismissible: true
        });
        this.toastRef?.updateMessage('File load error. Try with some other file');
      };
    }
  }

  upload(media: Blob, imageBase: string, fileName: string): void {
    this.toastRef?.close();
    this.toastRef = this.hotToastService.loading('Uploading Media...', {
      dismissible: false
    });
    this.isUploading = true;
    this.cdr.markForCheck();
    this.authFacade.token$.pipe(
      filter((value) => value !== undefined),
      switchMap((token) => this.mediaUploadService.uploadMedia(media, token))
    ).subscribe(
      (res) => {
        this.toastRef?.updateMessage('Success! Media Uploaded');
        this.toastRef?.updateToast({
          dismissible: true,
          type: 'success'
        });
        this.imageUploadRes.emit({
          croppedImage: imageBase,
          attachmentId: res.attachmentId,
          fileName
        });
        this.isUploading = false;
        this.cdr.markForCheck();
      },
      () => {
        this.toastRef?.close();
        this.isUploading = false;
        this.cdr.markForCheck();
      }
    );
  }

}
