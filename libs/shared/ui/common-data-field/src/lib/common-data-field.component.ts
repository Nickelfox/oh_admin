import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { GoalAnswer } from '@hidden-innovation/shared/models';

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
      <span *ngFor='let goal of goals'>
            <h4  class='mat-body-2 font-weight-light'>{{goal.answerString || '--'}}</h4>
      </span>
    </hidden-innovation-common-data-field-skeleton>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDataFieldComponent {
  @Input() label?: string | null;
  @Input() goals?: GoalAnswer[];
  @Input() value?: string | number | null | undefined;
  @Input() isLoading?: boolean | null;
}
