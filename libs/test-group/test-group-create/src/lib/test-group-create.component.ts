import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TestSelectorComponent } from '@hidden-innovation/shared/ui/test-selector';
import { TestGroupCore, TestGroupStore } from '@hidden-innovation/test-group/data-access';
import { FormArray, FormControl, FormGroup, ValidatorFn } from '@ngneat/reactive-forms';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';
import { AspectRatio } from '@hidden-innovation/media';
import { Tag, TagsStore } from '@hidden-innovation/tags/data-access';
import { paginatorData } from '@hidden-innovation/user/data-access';

@Component({
  selector: 'hidden-innovation-test-group-create',
  templateUrl: './test-group-create.component.html',
  styleUrls: ['./test-group-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupCreateComponent implements OnInit {

  testTags: Tag[] = [];

  requiredFieldValidation: ValidatorFn[] = [
    RxwebValidators.required(),
    RxwebValidators.notEmpty()
  ];

  testCatTypeIte = Object.values(TagCategoryEnum).map(value => value.toString());

  aspectRatio = AspectRatio;

  testGroup: FormGroup<TestGroupCore> = new FormGroup<TestGroupCore>({
    name: new FormControl('', [
      ...this.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
      })
    ]),
    description: new FormControl('', [
      ...this.requiredFieldValidation
    ]),
    category: new FormControl(undefined, [
      ...this.requiredFieldValidation
    ]),
    videoId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    thumbnailId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    imageId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    is_visible: new FormControl(false),
    subCategory: new FormControl(''),
    tests: new FormArray<number>([])
  });

  constructor(
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public store: TestGroupStore,
    public constantDataService: ConstantDataService,
    public formValidationService: FormValidationService,
    public tagsStore: TagsStore
  ) {
    const { category, subCategory, tests } = this.testGroup.controls;
    const testFormArray: FormArray<number> = tests as FormArray<number>;
    this.store.selectedTests$.subscribe(newTests => {
      testFormArray.clear();
      newTests.forEach(t => {
        testFormArray.push(new FormControl<number>(t.id));
      });
    });
    category.valueChanges.subscribe(_ => {
      subCategory.reset();
    });
  }

  ngOnInit(): void {
    this.getTags();
  }

  submit(): void {
    const subCat: Tag = this.testGroup.controls.subCategory.value as Tag;
    this.testGroup.markAllAsTouched();
    this.testGroup.markAllAsDirty();
  }

  openTestSelector(): void {
    this.matDialog.open(TestSelectorComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      role: 'dialog'
    });
  }

  getTags(search?: string) {
    this.tagsStore.getTags$({
      page: paginatorData.pageIndex,
      limit: paginatorData.pageSize,
      type: [TagTypeEnum.SUB_CATEGORY],
      search: search ?? undefined,
      dateSort: undefined,
      category: (this.testGroup.value.category) ? [this.testGroup.value.category] : [],
      nameSort: undefined
    });
  }

  displayFn(tag: Tag): string {
    return tag && tag.name ? tag.name : '';
  }

  isExistingTag(tag: Tag): boolean {
    if (this.testTags) {
      return !!this.testTags.find(t => t.id === tag.id);
    } else {
      return false;
    }
  }

}
