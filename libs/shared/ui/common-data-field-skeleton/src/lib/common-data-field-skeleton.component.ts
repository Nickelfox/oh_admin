import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'hidden-innovation-common-data-field-skeleton',
  template: `
    <div class='form-group'>
      <div class='font-calibri--bold'>
        <label class='mat-subheading-1'>{{(label | uppercase) || '--'}}</label>
      </div>
      <div class='font-sf-pro--bold mt-2'>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./common-data-field-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDataFieldSkeletonComponent {

  @Input() label?: string | null;

}
