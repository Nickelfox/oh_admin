import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FormGroupDirective } from '@angular/forms';
import { ConstantDataService } from '@hidden-innovation/shared/form-config';

@Component({
  selector: 'hidden-innovation-common-form-field-date-range',
  template: `
    <mat-form-field class='w-100'>
      <mat-label>Enter a date range</mat-label>
      <mat-date-range-input separator='to' [rangePicker]='picker'>
        <input matStartDate readonly type='text' placeholder='Start' [formControl]='startControl'>
        <input matEndDate readonly type='text' placeholder='End' [formControl]='endControl'>
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]='picker'></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
      <mat-error *ngIf='endControl.errors?.required'>Both valid dates are required</mat-error>
    </mat-form-field>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFormFieldDateRangeComponent implements OnInit {
  @Input() startControlPath: any;
  @Input() endControlPath: any;
  // @Input() startView: 'month' | 'year' | 'multi-year' = 'month';

  startControl = new FormControl();
  endControl = new FormControl();

  constructor(
    private fgd: FormGroupDirective,
    private constantDataService: ConstantDataService
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
