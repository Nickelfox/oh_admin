import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FormGroupDirective } from '@angular/forms';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { DateTime } from 'luxon';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd/LL/yyyy'
  },
  display: {
    dateInput: 'dd/LL/yyyy',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'hidden-innovation-common-form-field-date',
  template: `
<!--    <mat-form-field class='w-100'>-->
<!--      <mat-label>Select A Date</mat-label>-->
<!--      <input matInput readonly [matDatepicker]='picker' clear type='text' [max]='maxDate'-->
<!--             [formControl]='control' [min]='minDate'>-->
<!--      <mat-error *ngIf='control.errors?.required && !control.value'>-->
<!--        Date {{formValidationService.fieldValidationMessage.required}}</mat-error>-->
<!--      <mat-datepicker-toggle matSuffix [for]='picker'></mat-datepicker-toggle>-->
<!--      <mat-datepicker #picker></mat-datepicker>-->
<!--    </mat-form-field>-->
<mat-form-field class='w-100'>
  <mat-label >Select Range</mat-label >
  <mat-date-range-input [max]='maxDate' separator='to' [rangePicker]='weekPicker'>
    <input matStartDate readonly type='text' placeholder='Start' [formControl]='startControl'>
    <input matEndDate readonly type='text'  placeholder='End' [formControl]='endControl'>
  </mat-date-range-input>
  <mat-datepicker-toggle matSuffix [for]='weekPicker'></mat-datepicker-toggle>
  <mat-date-range-picker #weekPicker></mat-date-range-picker>
  <mat-error *ngIf='endControl.errors?.required'>
    Range {{formValidationService.fieldValidationMessage.required}}</mat-error>
  <mat-error *ngIf='endControl.errors?.matDatepickerMax'>Valid week is required</mat-error>
</mat-form-field>
  `,
  styleUrls: ['./common-form-field-date.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CommonFormFieldDateComponent implements OnInit {
  @Input() startControlPath: any;
  @Input() endControlPath: any;
  @Input() maxDate?: Date | DateTime;

  startControl = new FormControl();
  endControl = new FormControl();

  constructor(
    private fgd: FormGroupDirective,
    private constantDataService: ConstantDataService,
    public formValidationService: FormValidationService
  ) {
  }
  ngOnInit(): void {
    this.startControl = this.fgd.control.get(
      this.startControlPath
    ) as FormControl;
    this.endControl = this.fgd.control.get(
      this.endControlPath
    ) as FormControl;
  }

  clearDateFilter(): void {
    this.startControl.setValue(null);
    this.endControl.setValue(null);
  }
}
