import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FormGroupDirective } from '@angular/forms';
import { VideoPickedResponseData } from '@hidden-innovation/media';

@Component({
  selector: 'hidden-innovation-common-form-field-video',
  templateUrl: './common-form-field-video.component.html',
  styleUrls: ['./common-form-field-video.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFormFieldVideoComponent implements OnInit {

  @Input() controlPath: any;
  @Input() parentCtrl!: FormControl;

  @Output() emitVideoCtrlData: EventEmitter<number> = new EventEmitter<number>();
  @Output() emitRemoveVideo: EventEmitter<undefined> = new EventEmitter<undefined>();

  control = new FormControl();

  fileName: string | undefined;

  constructor(
    private fgd: FormGroupDirective,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.control = this.fgd.control.get(
      this.controlPath
    ) as FormControl;
    this.control.valueChanges.subscribe(_ => this.cdr.markForCheck());
  }

  removeVideo() {
    this.fileName = undefined;
    this.emitRemoveVideo.emit();
  }

  mapVideo($event: VideoPickedResponseData) {
    this.fileName = $event.fileName;
    this.emitVideoCtrlData.emit($event.attachmentId);
  }
}
