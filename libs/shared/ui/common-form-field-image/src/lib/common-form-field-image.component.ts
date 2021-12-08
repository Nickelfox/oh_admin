import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FormGroupDirective } from '@angular/forms';
import { ImageCropperResponseData } from '@hidden-innovation/media';

@Component({
  selector: 'hidden-innovation-common-form-field-image',
  templateUrl: './common-form-field-image.component.html',
  styleUrls: ['./common-form-field-image.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFormFieldImageComponent implements OnInit {

  @Input() controlPath: any;
  @Input() parentCtrl!: FormControl;

  @Output() emitImageCtrlData: EventEmitter<number> = new EventEmitter<number>();
  @Output() emitRemoveImage: EventEmitter<undefined> = new EventEmitter<undefined>();

  control = new FormControl();

  imageData: ImageCropperResponseData | undefined;

  constructor(
    private fgd: FormGroupDirective
  ) {
  }

  ngOnInit(): void {
    this.control = this.fgd.control.get(
      this.controlPath
    ) as FormControl;
  }

  removeImage() {
    this.imageData = undefined;
    this.emitRemoveImage.emit();
  }

  mapImage($event: ImageCropperResponseData) {
    this.imageData = $event;
    this.emitImageCtrlData.emit($event.attachmentId);
  }
}
