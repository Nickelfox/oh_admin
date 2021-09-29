import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { FormControl } from '@ngneat/reactive-forms';

@Component({
  selector: 'hidden-innovation-common-form-select-field',
  templateUrl: './common-form-select-field.component.html',
  styleUrls: ['./common-form-select-field.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFormSelectFieldComponent implements OnInit {

  @Input() controlPath: any;
  @Input() placeholder = '';
  @Input() label = '';
  @Input() options: string[] = [];

  control = new FormControl();

  constructor(
    private fgd: FormGroupDirective,
    public formValidationService: FormValidationService
  ) { }

  ngOnInit(): void {
    this.control = this.fgd.control.get(
      this.controlPath
    ) as FormControl;
  }

}
