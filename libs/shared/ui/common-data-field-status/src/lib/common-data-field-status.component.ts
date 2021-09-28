import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { StatusChipType } from '@hidden-innovation/shared/models';

@Component({
  selector: 'hidden-innovation-common-data-field-status',
  template: `
    <mat-chip-list>
      <mat-chip class='{{chipClass}}'>
        <span>{{chipText}}</span>
        <mat-icon matChipTrailingIcon>fiber_manual_record</mat-icon>
      </mat-chip>
    </mat-chip-list>
  `,
  styleUrls: ['./common-data-field-status.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDataFieldStatusComponent {
  @Input() chipType!: StatusChipType | null;
  @Input() text?: string;

  get chipClass(): string {
    return (this.chipType === StatusChipType.SUCCESS) ?
      'mat-chip--success' : (this.chipType === StatusChipType.ERROR) ?
        'mat-chip--error' : '';
  }

  get chipText(): string {
    return this.text ? this.text : (this.chipType === StatusChipType.SUCCESS) ?
      'Active' : (this.chipType === StatusChipType.ERROR) ? 'InActive' : '--';
  }
}
