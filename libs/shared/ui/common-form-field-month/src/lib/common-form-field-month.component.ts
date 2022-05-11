import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateTime } from 'luxon';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@ngneat/reactive-forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormGroupDirective } from '@angular/forms';
import { FormValidationService } from '@hidden-innovation/shared/form-config';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL/y'
  },
  display: {
    dateInput: 'LL/y',
    monthYearLabel: 'LL y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'LLLL y'
  }
};

@Component({
  selector: 'hidden-innovation-common-form-field-month',
  template: `
    <mat-form-field class='w-100'>
      <mat-label>Select A Month</mat-label>
      <input [max]='maxDate' [min]='minDate' matInput [matDatepicker]='monthPicker' type='text' [formControl]='control'>
      <mat-error *ngIf='control.errors?.required && !control.value'>
        Month {{formValidationService.fieldValidationMessage.required}}</mat-error>
      <mat-datepicker-toggle matSuffix [for]='monthPicker'></mat-datepicker-toggle>
      <mat-datepicker #monthPicker
                      startView='multi-year'
                      (monthSelected)='chosenMonthHandler($event)'>
      </mat-datepicker>
    </mat-form-field>
  `,
  styleUrls: ['./common-form-field-month.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CommonFormFieldMonthComponent implements OnInit {
  @Input() controlPath!: string;
  @Input() maxDate: Date | DateTime | null = null;
  @Input() minDate: Date | DateTime | null = null;

  control = new FormControl();

  @ViewChild('monthPicker') datePicker: MatDatepicker<Date | DateTime> | undefined;

  constructor(
    private fgd: FormGroupDirective,
    public formValidationService: FormValidationService
  ) {
  }

  ngOnInit(): void {
    this.control = this.fgd.control.get(
      this.controlPath
    ) as FormControl;
  }

  chosenMonthHandler(normalizedMonth: DateTime) {
    this.datePicker?.close();
    this.control.setValue(normalizedMonth);
  }
}
