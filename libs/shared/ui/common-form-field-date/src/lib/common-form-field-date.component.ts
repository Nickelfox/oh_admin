import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FormGroupDirective } from '@angular/forms';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { DateTime } from 'luxon';

@Component({
  selector: 'hidden-innovation-common-form-field-date',
  template: `
    <mat-form-field class='w-100'>
      <mat-label>Select A Date</mat-label>
      <input matInput readonly [matDatepicker]='picker' clear type='text' [max]='maxDate'
             [formControl]='control' [min]='minDate'>
      <mat-error *ngIf='control.errors?.required && !control.value'>
        Date {{formValidationService.fieldValidationMessage.required}}</mat-error>
      <mat-datepicker-toggle matSuffix [for]='picker'></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
  styleUrls: ['./common-form-field-date.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFormFieldDateComponent implements OnInit {

  @Input() controlPath: any;
  @Input() maxDate?: Date | DateTime | string;
  @Input() minDate?: Date | DateTime | string;

  control = new FormControl();

  constructor(
    private fgd: FormGroupDirective,
    private constantDataService: ConstantDataService,
    public formValidationService: FormValidationService
  ) {
  }

  ngOnInit(): void {
    this.control = this.fgd.control.get(
      this.controlPath
    ) as FormControl;
  }

}
