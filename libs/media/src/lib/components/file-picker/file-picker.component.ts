import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FilePickedResponseData } from '@hidden-innovation/media';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { MediaService } from '../../services/media.service';
import { AuthFacade } from '@hidden-innovation/auth';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';
import { filter, switchMap } from 'rxjs/operators';
import { FileNameDialogComponent } from '../../../../../shared/ui/file-name-dialog/src';

@Component({
  selector: 'hidden-innovation-file-picker',
  template: `
    <input hidden type='file' accept='application/*,audio/*,image/*,text/*' (change)='filePicked($event, filePicker)'
           #filePicker>
    <button [disabled]='isUploading' mat-stroked-button color='{{isInvalid ? "warn" : "primary"}}'
            (click)='filePicker.click()'
            type='button'>
      <mat-icon class='mr-2'>upload</mat-icon>
      Upload
    </button>
  `,
  styleUrls: ['./file-picker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilePickerComponent implements OnInit {

  @Input() isInvalid = false;

  @Output() emitFile: EventEmitter<FilePickedResponseData> = new EventEmitter<FilePickedResponseData>();

  isUploading = false;
  toastRef: CreateHotToastRef<unknown> | undefined;

  file?: File;

  constructor(
    private matDialog: MatDialog,
    private mediaUploadService: MediaService,
    private hotToastService: HotToastService,
    private cdr: ChangeDetectorRef,
    private authFacade: AuthFacade,
    private constantDataService: ConstantDataService
  ) {
  }

  ngOnInit(): void {
  }

  clearPicker(filePicker: HTMLInputElement): void {
    filePicker.value = '';
    filePicker.removeAttribute('src');
  }

  filePicked($event: any, filePicker: HTMLInputElement) {
    if ($event.target.files && $event.target.files?.length) {
      const [file] = $event.target.files;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = _ => {
        this.toastRef = this.hotToastService.loading('Loading File...');
      };
      reader.onload = _ => {
        // End metadata gathering
        if (file.size > this.constantDataService.FIZE_SIZE_DATA.limit) {
          // file size validation
          this.toastRef?.close();
          this.clearPicker(filePicker);
          this.hotToastService.error(this.constantDataService.FIZE_SIZE_DATA.limitMessage);
          return;
        }
        const fileNameArray: string[] = file.type.split('/');
        if (fileNameArray.includes(this.constantDataService.FILE_FORMAT_DATA.pdf) && fileNameArray.includes(this.constantDataService.FILE_FORMAT_DATA.audio) && fileNameArray.includes(this.constantDataService.FILE_FORMAT_DATA.image) && fileNameArray.includes(this.constantDataService.FILE_FORMAT_DATA.text) && fileNameArray.includes(this.constantDataService.FILE_FORMAT_DATA.video)) {
          // Video Format validation
          this.toastRef?.close();
          this.clearPicker(filePicker);
          this.hotToastService.error(this.constantDataService.FIZE_SIZE_DATA.fileFormatMessage);
          return;
        }
        // Upload after it passed all the validation here.
        this.confirmFileName(file, this.mediaUploadService.removeExtension(file.name));
      };
      reader.onloadend = _ => {
        this.toastRef?.close();
        this.clearPicker(filePicker);
      };
      reader.onerror = _ => {
        this.clearPicker(filePicker);
        this.toastRef?.updateToast({
          type: 'error',
          dismissible: true
        });
        this.toastRef?.updateMessage('File load error. Try with some other format.');
      };
    } else {
      this.toastRef?.updateMessage('File load error. Might be an application issue');
    }
  }

  confirmFileName(file: File, fileName: string): void {
    const dialogRef = this.matDialog.open(FileNameDialogComponent, {
      data: fileName,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((newFileName: string | undefined) => {
      if (newFileName) {
        this.upload(file, newFileName);
      }
    });
  }

  upload(file: File, fileName: string): void {
    this.toastRef?.close();
    this.toastRef = this.hotToastService.loading('Uploading File...', {
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
        this.toastRef?.updateMessage('Success! File Uploaded');
        this.toastRef?.updateToast({
          dismissible: true,
          type: 'success'
        });
        this.isUploading = false;
        this.emitFile.emit({
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
