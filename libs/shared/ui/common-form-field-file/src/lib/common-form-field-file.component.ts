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
import { FormControl } from '@ngneat/reactive-forms';
import { FormGroupDirective } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FilePickedResponseData, Media } from '@hidden-innovation/media';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-common-form-field-file',
  template: `
    <div class='container-fluid p-0'>
      <div class='row'>
        <ng-template [ngIf]='parentCtrl.valid && fileName' [ngIfElse]='fileSelectedElse'>
          <div class='col'>
            <button mat-stroked-button color='primary'
                    type='button'>
              <mat-icon color='warn' class='mr-1'>{{fileIcon ?? 'attach_file'}}</mat-icon>
              <a *ngIf='fileUrl' href='{{fileUrl}}' target='_blank'
                 matTooltip='{{fileName ?? "--"}}'>{{(fileName | maxStringLimit: 10) ?? '--'}}</a>
              <a *ngIf='!fileUrl' matTooltip='{{fileName ?? "--"}}'>{{(fileName | maxStringLimit: 10) ?? '--'}}</a>
              <mat-icon matTooltip='Remove File' (click)='removeFile()' class='ml-2'>close</mat-icon>
            </button>
          </div>
        </ng-template>
        <ng-template #fileSelectedElse>
          <div class='col'>
            <hidden-innovation-file-picker
              [isInvalid]='!!((parentCtrl.invalid && (parentCtrl.touch$ | async)))'
              (emitFile)='mapFile($event)'
            ></hidden-innovation-file-picker>
            <mat-error
              *ngIf='!!(parentCtrl.invalid && (parentCtrl.touch$ | async))'>
              <small class='ml-2'>File is required</small></mat-error>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./common-form-field-file.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFormFieldFileComponent implements OnInit {

  @Input() controlPath: any;
  @Input() parentCtrl!: FormControl;

  @Output() emitFileCtrlData: EventEmitter<number> = new EventEmitter<number>();
  @Output() emitRemoveFile: EventEmitter<undefined> = new EventEmitter<undefined>();

  control = new FormControl();

  fileName: string | undefined;
  fileUrl: string | undefined;
  fileIcon: string | undefined;

  constructor(
    private fgd: FormGroupDirective,
    private cdr: ChangeDetectorRef
  ) {
  }

  @Input() set fileData(media: Media | undefined) {
    if (media) {
      this.fileName = media.fileName;
      this.fileUrl = media.url;
    }
  }

  ngOnInit(): void {
    this.control = this.fgd.control.get(
      this.controlPath
    ) as FormControl;
    this.control.valueChanges.subscribe(_ => this.cdr.markForCheck());
  }

  removeFile() {
    this.fileName = undefined;
    this.emitRemoveFile.emit();
  }

  mapFile($event: FilePickedResponseData) {
    this.fileName = $event.fileName;
    this.fileIcon = $event.icon;
    this.emitFileCtrlData.emit($event.attachmentId);
  }

}
