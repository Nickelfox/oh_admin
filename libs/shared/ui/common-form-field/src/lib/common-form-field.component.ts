import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormValidationService, GenericErrorMessage } from '@hidden-innovation/shared/form-config';
import { FormGroupDirective } from '@angular/forms';
import { FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy } from '@ngneat/until-destroy';

@Component({
  selector: 'hidden-innovation-common-form-field',
  templateUrl: './common-form-field.component.html',
  styleUrls: ['./common-form-field.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFormFieldComponent implements OnInit {

  @Input() controlPath: any;
  @Input() placeholder = '';
  @Input() label = '';
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() errorMessage: Partial<GenericErrorMessage> = this.formValidationService.fieldValidationMessage;

  control = new FormControl();

  constructor(
    private fgd: FormGroupDirective,
    public formValidationService: FormValidationService,
  ) {
  }

  ngOnInit(): void {
    this.control = this.fgd.control.get(
      this.controlPath
    ) as FormControl;
  }

}
