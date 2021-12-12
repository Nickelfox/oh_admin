import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { MediaUploadService } from '../../services/media-upload.service';
import { AuthFacade } from '@hidden-innovation/auth';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { filter, switchMap } from 'rxjs/operators';
import { VideoPickedResponseData } from '../../models/media.interface';
import { getMetadata } from 'video-metadata-thumbnails';

@Component({
  selector: 'hidden-innovation-video-picker',
  templateUrl: './video-picker.component.html',
  styleUrls: ['./video-picker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPickerComponent {

  @Input() isInvalid = false;

  @Output() emitVideoFile: EventEmitter<VideoPickedResponseData> = new EventEmitter<VideoPickedResponseData>();

  isUploading = false;
  toastRef: CreateHotToastRef<unknown> | undefined;

  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  file?: File;

  constructor(
    private matDialog: MatDialog,
    private mediaUploadService: MediaUploadService,
    private hotToastService: HotToastService,
    private cdr: ChangeDetectorRef,
    private authFacade: AuthFacade,
    private constantDataService: ConstantDataService
  ) {
  }

  clearPicker(videoPicker: HTMLInputElement): void {
    videoPicker.value = '';
    videoPicker.removeAttribute('src');
  }


  filePicked($event: any, videoPicker: HTMLInputElement) {
    if ($event.target.files && $event.target.files?.length) {
      const [file] = $event.target.files;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = _ => {
        this.toastRef = this.hotToastService.loading('Loading Video...');
      };
      reader.onload = async _ => {
        // Getting video meta data for validation
        const metadata = await getMetadata(file);
        let height = 0, width = 0;
        width = metadata.width;
        height = metadata.height;
        width *= 1;
        const valHeight = width != 0 ? Math.round((width / 16) * 9) : 0;
        // End metadata gathering
        if (file.size > this.constantDataService.FIZE_SIZE_DATA.limit) {
          // Video size validation
          this.toastRef?.close();
          this.clearPicker(videoPicker);
          this.hotToastService.error(this.constantDataService.FIZE_SIZE_DATA.limitMessage);
          return;
        }
        if (file.type !== this.constantDataService.FILE_FORMAT_DATA.video_mp4 && file.type !== this.constantDataService.FILE_FORMAT_DATA.video_mov) {
          // Video Format validation
          this.toastRef?.close();
          this.clearPicker(videoPicker);
          this.hotToastService.error(this.constantDataService.FIZE_SIZE_DATA.videoFormatMessage);
          return;
        }
        if (valHeight !== height) {
          // 16:9 ratio validation
          this.toastRef?.close();
          this.clearPicker(videoPicker);
          this.hotToastService.error(this.constantDataService.FIZE_SIZE_DATA.videoRatioMessage);
          return;
        }
        // Upload after it passed all the validation here.
        this.upload(file, file.name);
      };
      reader.onloadend = _ => {
        this.toastRef?.close();
        this.clearPicker(videoPicker);
      };
      reader.onerror = _ => {
        this.clearPicker(videoPicker);
        this.toastRef?.updateToast({
          type: 'error',
          dismissible: true
        });
        this.toastRef?.updateMessage('File load error. Try with some other valid mp4 file.');
      };
    } else {
      this.toastRef?.updateMessage('File load error. Might be an application issue');
    }
  }

  upload(file: File, fileName: string): void {
    this.toastRef?.close();
    this.toastRef = this.hotToastService.loading('Uploading Media...', {
      dismissible: false,
      autoClose: false
    });
    this.isUploading = true;
    this.cdr.markForCheck();
    this.authFacade.token$.pipe(
      filter((value) => value !== undefined),
      switchMap((token) => this.mediaUploadService.uploadMedia(file, fileName, token))
    ).subscribe(
      ({ attachmentId }) => {
        this.toastRef?.updateMessage('Success! Media Uploaded');
        this.toastRef?.updateToast({
          dismissible: true,
          type: 'success'
        });
        this.isUploading = false;
        this.emitVideoFile.emit({
          fileName,
          attachmentId
        });
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
