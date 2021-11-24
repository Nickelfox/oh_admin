import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SortingEnum } from '@hidden-innovation/shared/models';

@Component({
  selector: 'hidden-innovation-sorting-header-date',
  templateUrl: './sorting-header-date.component.html',
  styleUrls: ['./sorting-header-date.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortingHeaderDateComponent {

  @Input() isDisabled?: boolean | null;
  @Input() ctrlEnabled?: boolean;
  @Input() ctrlValue?: string;
  @Input() title?: string;

  @Output() emitSorting: EventEmitter<string> = new EventEmitter<string>();

  sortingEnum = SortingEnum;

}
