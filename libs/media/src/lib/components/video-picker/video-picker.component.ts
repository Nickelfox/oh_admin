import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { MediaUploadService } from '../../services/media-upload.service';
import { AuthFacade } from '@hidden-innovation/auth';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { filter, switchMap } from 'rxjs/operators';
import { VideoPickedResponseData } from '@hidden-innovation/media';

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

  constructor(
    private matDialog: MatDialog,
    private mediaUploadService: MediaUploadService,
    private hotToastService: HotToastService,
    private cdr: ChangeDetectorRef,
    private authFacade: AuthFacade,
    private constantDataService: ConstantDataService
  ) {
  }


  filePicked($event: any, videoPicker: HTMLInputElement) {
    if ($event.target.files && $event.target.files[0]) {
      const [file] = $event.target.files;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = _ => {
        this.toastRef = this.hotToastService.loading('Loading Video...');
      };
      reader.onload = _ => {
        if (file.size > this.constantDataService.FIZE_SIZE_DATA.limit) {
          this.toastRef?.close();
          this.hotToastService.error(this.constantDataService.FIZE_SIZE_DATA.limitMessage);
          videoPicker.value = '';
          videoPicker.removeAttribute('src');
        } else {
          this.upload(file, file.name);
        }
      };
      reader.onloadend = _ => {
        videoPicker.value = '';
        videoPicker.removeAttribute('src');
      };
      reader.onerror = _ => {
        videoPicker.value = '';
        videoPicker.removeAttribute('src');
        this.toastRef?.updateToast({
          type: 'error',
          dismissible: true
        });
        this.toastRef?.updateMessage('File load error. Try with some other valid mp4 file.');
      };
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
