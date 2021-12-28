import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TestSelectorComponent } from '@hidden-innovation/shared/ui/test-selector';
import { TestGroup, TestGroupCore, TestGroupStore } from '@hidden-innovation/test-group/data-access';
import { FormArray, FormControl, FormGroup, ValidatorFn } from '@ngneat/reactive-forms';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { OperationTypeEnum, TagCategoryEnum, TagTypeEnum } from '@hidden-innovation/shared/models';
import { AspectRatio } from '@hidden-innovation/media';
import { Tag, TagsStore } from '@hidden-innovation/tags/data-access';
import { HotToastService } from '@ngneat/hot-toast';
import { filter, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Test } from '@hidden-innovation/test/data-access';
import { UiStore } from '@hidden-innovation/shared/store';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-test-group-create',
  templateUrl: './test-group-create.component.html',
  styleUrls: ['./test-group-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGroupCreateComponent implements OnDestroy {

  requiredFieldValidation: ValidatorFn[] = [
    RxwebValidators.required(),
    RxwebValidators.notEmpty()
  ];

  selectedTestGroup?: TestGroup;

  testCatTypeIte = Object.values(TagCategoryEnum).map(value => value.toString());

  aspectRatio = AspectRatio;

  tagTypeEnum = TagTypeEnum;

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
    subCategory: new FormControl(''),
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
    isVisible: new FormControl(false),
    tests: new FormArray<number>([])
  });

  opType?: OperationTypeEnum;
  selectedTests: Test[] = [];
  private testGroupID?: number;

  constructor(
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private hotToastService: HotToastService,
    public store: TestGroupStore,
    public constantDataService: ConstantDataService,
    public formValidationService: FormValidationService,
    public tagsStore: TagsStore,
    private route: ActivatedRoute,
    public uiStore: UiStore
  ) {
    this.route.data.pipe(
      filter(data => data?.type !== undefined),
      tap((data) => {
        this.opType = data.type as OperationTypeEnum;
      }),
      switchMap(_ => this.route.params)
    ).subscribe((res) => {
      if (this.opType === OperationTypeEnum.EDIT) {
        this.restoreSelectedState();
        this.testGroupID = res['id'];
        if (!this.testGroupID) {
          this.hotToastService.error('Error occurred while fetching details');
          return;
        }
        this.store.getTestGroupDetails$({
          id: this.testGroupID
        });
        this.store.selectedTestGroup$.subscribe((tg) => {
          if (tg) {
            this.populateTest(tg);
          }
        });
      }
    });
    const { category, subCategory, tests, isVisible } = this.testGroup.controls;
    const testFormArray: FormArray<number> = tests as FormArray<number>;
    this.uiStore.selectedTests$.subscribe(newTests => {
      this.selectedTests = newTests;
      testFormArray.clear();
      newTests.forEach(t => {
        testFormArray.push(new FormControl<number>(t.id, [RxwebValidators.required()]));
        testFormArray.updateValueAndValidity();
      });
    });
    category.valueChanges.subscribe(_ => {
      subCategory.reset();
    });
    tests.valueChanges.subscribe(_ => {
      this.testsIsValid ? isVisible.setValue(true) : isVisible.setValue(false);
      this.testGroup.updateValueAndValidity();
    });
  }

  get testsIsValid(): boolean {
    return this.testGroup.controls.tests.value?.length >= 2;
  }

  get getSubCategoryValue(): string {
    const subCatCtrl = this.testGroup.controls.subCategory as FormControl<Tag | string>;
    return typeof subCatCtrl.value === 'string' ? subCatCtrl.value : subCatCtrl.value.name;
  }

  trackByFn(index: number, test: Test): number {
    return test.id;
  }

  deleteSelectedTest(test: Test): void {
    if (this.selectedTests.find(value => value.id === test.id)) {
      this.uiStore.patchState({
        selectedTests: [
          ...this.selectedTests.filter(t => t.id !== test.id)
        ]
      });
    }
  }

  submit(): void {
    this.testGroup.markAllAsTouched();
    this.testGroup.markAllAsDirty();
    if (this.testGroup.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    const testGroupObj: TestGroupCore = {
      ...this.testGroup.value,
      subCategory: this.getSubCategoryValue
    };
    if (this.opType === OperationTypeEnum.CREATE) {
      this.store.createTestGroup$(testGroupObj);
    } else if (this.opType === OperationTypeEnum.EDIT) {
      if (!this.testGroupID) {
        this.hotToastService.error('Error occurred while submitting details');
        return;
      }
      this.store.updateTestGroup$({
        testGroup: testGroupObj,
        id: this.testGroupID
      });
    }
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

  restoreSelectedState(): void {
    this.uiStore.patchState({
      selectedTests: []
    });
    this.store.patchState({
      selectedGroup: undefined
    });
  }

  ngOnDestroy(): void {
    this.restoreSelectedState();
  }

  private populateTest(testGroup: TestGroup): void {
    const { isVisible, category, imageId, thumbnailId, subCategory, name, description } = testGroup;
    this.selectedTestGroup = testGroup;
    const selectedTests: Test[] = (testGroup.tests as Test[]) ?? [];
    this.uiStore.patchState({
      selectedTests
    });
    this.testGroup.controls.category.setValue(category);
    this.testGroup.patchValue({
      isVisible,
      imageId,
      thumbnailId,
      subCategory,
      name,
      description
    });
    this.testGroup.updateValueAndValidity();
    this.cdr.markForCheck();
  }


}
