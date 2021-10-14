import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartDatasets, ChartLabel } from '@rinminase/ng-charts';
import { DashboardStore } from './dashboard.store';
import { DashboardRangeFilterEnum } from '@hidden-innovation/shared/models';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { DashboardRequest } from './models/dashboard.interface';
import { Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { UntilDestroy } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'oh-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent {

  chartData: ChartDatasets = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series A' }

  ];
  chartLabels: ChartLabel[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ];

  dashboardRangeTypes: string[] = Object.keys(DashboardRangeFilterEnum);
  dashboardRangeFilterEnum = DashboardRangeFilterEnum;

  rangeFilterGroup: FormGroup<DashboardRequest> = new FormGroup<DashboardRequest>({
    type: new FormControl<DashboardRangeFilterEnum>(DashboardRangeFilterEnum.WEEKLY),
    start: new FormControl<string>('', [
      Validators.required
    ]),
    end: new FormControl<string>('', [
      Validators.required
    ])
  });

  maxDate = DateTime.now();

  constructor(
    public store: DashboardStore
  ) {
    this.rangeFilterGroup.controls.type.valueChanges.pipe(
      tap((res) => {
        switch (res) {
          case DashboardRangeFilterEnum.WEEKLY: this.rangeFilterGroup.patchValue({
            end: '',
            start: ''
          });
          break;
        }
        this.rangeFilterGroup.patchValue({
          end: '',
          start: ''
        });
        this.rangeFilterGroup.markAsUntouched();
      })
    ).subscribe();
  }

  // get calenderView(): 'month' | 'year' | 'multi-year' {
  //   const type: DashboardRangeFilterEnum = this.rangeFilterGroup.controls.type.value;
  //   if (type === DashboardRangeFilterEnum.MONTHLY) {
  //     return 'month';
  //   }
  // }

  submit(): void {
    console.log(this.rangeFilterGroup);
  }
}
