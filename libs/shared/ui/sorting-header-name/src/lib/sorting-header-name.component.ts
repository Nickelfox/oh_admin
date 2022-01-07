import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SortingEnum, TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';

@Component({
  selector: 'hidden-innovation-sorting-header-name',
  templateUrl: './sorting-header-name.component.html',
  styleUrls: ['./sorting-header-name.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortingHeaderNameComponent {

  tagType = TagTypeEnum;

  tagTypeIte = Object.values(TagTypeEnum);
  tagCategoryIte = Object.values(TagCategoryEnum);

  @Input() isDisabled?: boolean | null;
  @Input() ctrlEnabled?: boolean;
  @Input() ctrlValue?: string;
  @Input() title?: string;

  @Output() emitSorting: EventEmitter<string> = new EventEmitter<string>();

  sortingEnum = SortingEnum;

}
