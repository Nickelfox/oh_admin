import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {GoalAnswer} from '@hidden-innovation/shared/models';

@Component({
  selector: 'hidden-innovation-common-data-field',
  template: `
    <hidden-innovation-common-data-field-skeleton [label]='label'>
      <hidden-innovation-shimmer
        *ngIf='isLoading'
        [rounded]='true'
        height='28px'
      ></hidden-innovation-shimmer>
      <h4 *ngIf='!goals' class='mat-body-2 font-weight-light'>{{value || '--'}}</h4>
      <ol type="number"  class="p-0 pl-3">
        <li *ngFor="let goal of goals"  class='mat-body-2 font-weight-light goalText p-0'><h4 class='mat-body-2 font-weight-light'>{{goal.answerString || "--"}}</h4></li>
      </ol>
    </hidden-innovation-common-data-field-skeleton>
  `,
  styles: [`ol>li::marker{ font-weight:bold;font-size: 14px}`],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDataFieldComponent {
  @Input() label?: string | null;
  @Input() goals?: GoalAnswer[];
  @Input() value?: string | number | null | undefined;
  @Input() isLoading?: boolean | null;



}
