import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hidden-innovation-common-data-field',
  template: `
    <hidden-innovation-common-data-field-skeleton [label]='label'>
      <content-loader viewBox='0 0 250 21' *ngIf='isLoading'>
        <svg:rect x="0" y="0" rx="3" ry="3" width="250" height="21" />
      </content-loader>
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
