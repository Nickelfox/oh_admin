import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Tag, TagsStore } from '@hidden-innovation/tags/data-access';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';
import { ConstantDataService, FormValidationService, GenericErrorMessage } from '@hidden-innovation/shared/form-config';
import { FormControl } from '@ngneat/reactive-forms';
import { FormGroupDirective } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-common-form-field-tag-autocomplete',
  template: `
    <mat-form-field class='w-100' *ngIf='fieldType === "CHIP"'>
      <mat-label>{{(isDisabled ? "Select Category First" : label) || "--"}}</mat-label>
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
          [disabled]='isDisabled'
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

    <mat-form-field class='w-100' *ngIf='fieldType === "INPUT"'>
      <mat-label>{{label || "--"}}</mat-label>
      <input
        [formControl]='control'
        autocomplete='no'
        #input
        (keyup)='getTagsTypeSingle(input.value)'
        (focusin)='getTagsTypeSingle(input.value)'
        type='text' matInput [matAutocomplete]='auto'>
      <mat-error>
        <ng-template [ngIf]='((control.touch$ | async) || (control.dirty$ | async)) && (control.errors$ | async)'
                     let-error>
          <hidden-innovation-form-field-errors
            [label]='label'
            [error]='error'
          ></hidden-innovation-form-field-errors>
        </ng-template>
      </mat-error>
      <mat-autocomplete #auto='matAutocomplete' [displayWith]='displayFn'>
        <ng-template [ngIf]='(store.isLoading$ | async)' [ngIfElse]='singleExElse'>
          <mat-option disabled>
            <div class='w-100 d-flex align-items-center justify-content-center'>
              <mat-spinner [diameter]='18'></mat-spinner>
            </div>
          </mat-option>
        </ng-template>
        <ng-template #singleExElse>
          <ng-template [ngIf]='(store.count$ | async)' [ngIfElse]='singleCountElse'>
            <ng-template ngFor [ngForOf]='(store.tags$ | async)' let-tag>
              <mat-option [value]='tag'>
                {{tag.name}}
              </mat-option>
            </ng-template>
          </ng-template>
          <ng-template #singleCountElse>
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
export class CommonFormFieldTagAutocompleteComponent implements OnInit {

  @Input() fieldType: 'CHIP' | 'INPUT' = 'CHIP';

  @Input() tagTypeEnum!: TagTypeEnum;
  @Input() tagCategory?: TagCategoryEnum | 'NONE';
  @Input() testTags: Tag[] = [];
  @Input() label?: string;
  @Input() isDisabled = false;

  @Input() controlPath: any;
  @Input() errorMessage: Partial<GenericErrorMessage> = this.formValidationService.fieldValidationMessage;
  control = new FormControl();


  @Output() updateTags: EventEmitter<Tag> = new EventEmitter<Tag>();
  @Output() removeTag: EventEmitter<Tag> = new EventEmitter<Tag>();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public store: TagsStore,
    private fgd: FormGroupDirective,
    public formValidationService: FormValidationService,
    public constantDataService: ConstantDataService
  ) {
  }

  getTags(cat: TagTypeEnum, search?: string) {
    this.store.getTags$({
      page: this.constantDataService.PaginatorData.pageIndex,
      limit: this.constantDataService.PaginatorData.pageSize,
      type: [cat],
      search: search ?? undefined,
      dateSort: undefined,
      category: (this.tagCategory && this.tagCategory !== 'NONE') ? [this.tagCategory] : [],
      nameSort: undefined
    });
  }

  getTagsTypeSingle(search?: string) {
    this.store.getTags$({
      page: this.constantDataService.PaginatorData.pageIndex,
      limit: this.constantDataService.PaginatorData.pageSize,
      type: [TagTypeEnum.SUB_CATEGORY],
      search: search ?? undefined,
      dateSort: undefined,
      category: (this.tagCategory && this.tagCategory !== 'NONE') ? [this.tagCategory] : [],
      nameSort: undefined
    });
  }

  displayFn(tag: Tag | string): string {
    if (typeof tag === 'string') {
      return tag as string;
    } else {
      return tag && tag?.name ? tag?.name : '';
    }
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

  ngOnInit(): void {
    if (this.fieldType === 'INPUT') {
      this.control = this.fgd.control.get(
        this.controlPath
      ) as FormControl;
    }
  }

}
