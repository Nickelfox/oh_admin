import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Tag, TagsStore } from '@hidden-innovation/tags/data-access';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';
import { paginatorData } from '@hidden-innovation/user/data-access';

@Component({
  selector: 'hidden-innovation-common-form-field-tag-autocomplete',
  template: `
    <mat-form-field class='w-100'>
      <mat-label>{{label || "--"}}</mat-label>
      <mat-chip-list #list aria-label='tag selection'>
        <ng-template ngFor [ngForOf]='testTags' let-tag>
          <mat-chip
            *ngIf='tag.tagType === tagTypeEnum'
            [value]='tag'
            [selectable]='true'>
            {{tag.name | maxStringLimit: 15}}
            <button type='button' matChipRemove (click)='removeTag.emit(tag)'>
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip>
        </ng-template>
        <input
          (keyup)='getTags(tagTypeEnum, input.value)'
          (focusin)='getTags(tagTypeEnum)'
          placeholder='New tag...'
          #input
          [matAutocomplete]='tagAuto'
          [matChipInputFor]='list'
          [matChipInputSeparatorKeyCodes]='separatorKeysCodes'>
      </mat-chip-list>
      <mat-autocomplete #tagAuto='matAutocomplete'>
        <ng-template [ngIf]='(store.isLoading$ | async)' [ngIfElse]='exElse'>
          <mat-option disabled>
            <div class='w-100 d-flex align-items-center justify-content-center'>
              <mat-spinner [diameter]='18'></mat-spinner>
            </div>
          </mat-option>
        </ng-template>
        <ng-template #exElse>
          <ng-template [ngIf]='(store.count$ | async)' [ngIfElse]='exCountElse'>
            <ng-template ngFor [ngForOf]='(store.tags$ | async)' let-tag>
              <mat-option [disabled]='isExistingTag(tag)'
                          (onSelectionChange)='emitUpdatedTags(tag, input)'
                          [value]='tag'>
                {{tag.name}}
              </mat-option>
            </ng-template>
          </ng-template>
          <ng-template #exCountElse>
            <mat-option disabled>No Results Found</mat-option>
          </ng-template>
        </ng-template>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFormFieldTagAutocompleteComponent {

  @Input() tagTypeEnum!: TagTypeEnum;
  @Input() tagCategory?: TagCategoryEnum | 'NONE';
  @Input() testTags: Tag[] = [];
  @Input() label?: string;

  @Output() updateTags: EventEmitter<Tag> = new EventEmitter<Tag>();
  @Output() removeTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public store: TagsStore
  ) {
  }

  getTags(cat: TagTypeEnum, search?: string) {
    this.store.getTags$({
      page: paginatorData.pageIndex,
      limit: paginatorData.pageSize,
      type: [cat],
      search: search ?? undefined,
      dateSort: undefined,
      category: (this.tagCategory && this.tagCategory !== 'NONE') ? [this.tagCategory] : [],
      nameSort: undefined
    });
  }

  isExistingTag(tag: Tag): boolean {
    if (this.testTags) {
      return !!this.testTags.find(t => t.id === tag.id);
    } else {
      return false;
    }
  }

  emitUpdatedTags(tag: Tag, input: HTMLInputElement): void {
    input.value = '';
    this.updateTags.emit(tag);
  }

}
