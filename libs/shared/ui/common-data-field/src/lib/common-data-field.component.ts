import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hidden-innovation-common-data-field',
  template: `
    <hidden-innovation-common-data-field-skeleton [label]='label'>
      <hidden-innovation-shimmer
        *ngIf='isLoading'
        [rounded]='true'
        height='28px'
      ></hidden-innovation-shimmer>
      <h4 *ngIf='!isLoading' class='mat-body-2 font-weight-light'>{{value || '--'}}</h4>
    </hidden-innovation-common-data-field-skeleton>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDataFieldComponent {
  @Input() label?: string | null;
  @Input() value?: string | number | null;
  @Input() isLoading?: boolean | null;
}
