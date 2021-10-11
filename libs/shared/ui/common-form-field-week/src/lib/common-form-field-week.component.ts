import { ChangeDetectionStrategy, Component, Injectable, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FormGroupDirective } from '@angular/forms';
import {
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDateRangeSelectionStrategy
} from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { DateTime } from 'luxon';
import { FormValidationService } from '@hidden-innovation/shared/form-config';

@Injectable()
export class SevenDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {
  }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createSevenDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createSevenDayRange(activeDate);
  }

  private _createSevenDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -3);
      const end = this._dateAdapter.addCalendarDays(date, 3);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }

}

@Component({
  selector: 'hidden-innovation-common-form-field-week',
  template: `
    <mat-form-field class='w-100'>
      <mat-label>Select Week (7Days)</mat-label>
      <mat-date-range-input [max]='maxDate' separator='to' [rangePicker]='weekPicker'>
        <input matStartDate readonly type='text' placeholder='Start' [formControl]='startControl'>
        <input matEndDate readonly type='text' placeholder='End' [formControl]='endControl'>
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]='weekPicker'></mat-datepicker-toggle>
      <mat-date-range-picker #weekPicker></mat-date-range-picker>
      <mat-error *ngIf='endControl.errors?.required'>
        Week {{formValidationService.fieldValidationMessage.required}}</mat-error>
      <mat-error *ngIf='endControl.errors?.matDatepickerMax'>Valid week is required</mat-error>
    </mat-form-field>
  `,
  styleUrls: ['./common-form-field-week.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: SevenDayRangeSelectionStrategy
  }]
})
export class CommonFormFieldWeekComponent implements OnInit {

  @Input() startControlPath: any;
  @Input() endControlPath: any;
  @Input() maxDate?: Date | DateTime;

  startControl = new FormControl();
  endControl = new FormControl();


  constructor(
    private fgd: FormGroupDirective,
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
