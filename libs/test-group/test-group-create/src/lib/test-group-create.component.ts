import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TestSelectorComponent, TestSelectorData} from '@hidden-innovation/shared/ui/test-selector';
import {ContentUrl, TestGroup, TestGroupCore, TestGroupStore} from '@hidden-innovation/test-group/data-access';
import {FormArray, FormControl, FormGroup, ValidatorFn} from '@ngneat/reactive-forms';
import {NumericValueType, RxwebValidators} from '@rxweb/reactive-form-validators';
import {ConstantDataService, FormValidationService} from '@hidden-innovation/shared/form-config';
import {
  ContentSelectorOpType,
  GenericDialogPrompt,
  OperationTypeEnum,
  TagCategoryEnum,
  TagTypeEnum
} from '@hidden-innovation/shared/models';
import {AspectRatio, Media} from '@hidden-innovation/media';
import {Tag, TagsStore} from '@hidden-innovation/tags/data-access';
import {HotToastService} from '@ngneat/hot-toast';
import {distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {UntilDestroy} from '@ngneat/until-destroy';
import {Test} from '@hidden-innovation/test/data-access';
import {UiStore} from '@hidden-innovation/shared/store';
import {PromptDialogComponent} from '@hidden-innovation/shared/ui/prompt-dialog';
import {isEqual} from 'lodash-es';
import {Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@UntilDestroy({checkProperties: true})
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
    overviewText: new FormControl('', [
      ...this.requiredFieldValidation,
      RxwebValidators.maxLength({
        value: this.formValidationService.FIELD_VALIDATION_VALUES.OVERVIEW_TEST_LENGTH
      })
    ]),
    isPublished: new FormControl(false),
    description: new FormControl('', [
      ...this.requiredFieldValidation
    ]),
    category: new FormControl('NONE', [
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
    videoId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),

    urls: new FormArray<ContentUrl>([]),
    imagesAndPdfsIds: new FormArray<number>([]),
    isVisible: new FormControl(false),
    tests: new FormArray<number>([], Validators.compose([
      Validators.required,
      Validators.minLength(2)
    ]))
  });

  opType?: OperationTypeEnum;
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
    const {category, tests, subCategory} = this.testGroup.controls;
    const testFormArray: FormArray<number> = tests as FormArray<number>;
    this.uiStore.selectedTests$.subscribe(newTests => {
      this.selectedTests = newTests;
      testFormArray.clear();
      newTests.forEach((t, i) => {
        testFormArray.push(new FormControl<number>(t.id, [RxwebValidators.required()]));
        testFormArray.updateValueAndValidity();
      });
    });
    category.valueChanges.pipe(
      distinctUntilChanged((oldCat, newCat) => {
        return isEqual(oldCat, newCat) && !this.testsExists;
      })
      // pairwise()
    ).subscribe((_) => {
      subCategory.reset();
      this.uiStore.patchState({
        selectedTests: []
      });
    });
  }

  _selectedTests: Test[] = [];
  get selectedTests(): Test[] {
    return this._selectedTests ?? [];
  }

  set selectedTests(tests: Test[]) {
    if (tests === undefined || tests === null) {
      return;
    }
    this._selectedTests = tests;
  }

  get testsIsValid(): boolean {
    return this.testGroup.controls.tests.value?.length >= 2;
  }

  get testsExists(): boolean {
    return this.testGroup.controls.tests.value?.length > 0;
  }

  get imagesAndPdfsArrayCtrl(): FormArray<number> {
    return this.testGroup.controls.imagesAndPdfsIds as FormArray<number>;
  }

  get getSubCategoryValue(): string {
    const subCatCtrl = this.testGroup.controls.subCategory as FormControl<Tag | string>;
    if (subCatCtrl.disabled || !subCatCtrl.value) {
      return '';
    }
    return typeof subCatCtrl.value === 'string' ? subCatCtrl.value : subCatCtrl.value.name;
  }

  get isCategoryValid(): boolean {
    const {category} = this.testGroup.controls;
    return category.valid;
    // && category.value !== 'NONE'
  }

  buildResourceFormCtrl(id?: number): FormControl<number> {
    return new FormControl<number>(id ?? undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]);
  }

  addResourceCtrl(id?: number): void {
    this.imagesAndPdfsArrayCtrl.push(this.buildResourceFormCtrl(id));
  }

  deleteResourceCtrl(index: number): void {
    this.imagesAndPdfsArrayCtrl.removeAt(index);
  }


  get urlFormArrayTestGroup(): FormArray<ContentUrl> {
    return this.testGroup.controls.urls as FormArray<ContentUrl>;
  }

  urlFormControl(i: number): FormGroup<ContentUrl> {
    return this.urlFormArrayTestGroup.controls[i] as FormGroup<ContentUrl>;
  }

  removeUrlCtrl(i: number): void {
    this.urlFormArrayTestGroup.removeAt(i);
  }

  addUrlCtrlTestGroup(urlObj?: ContentUrl): void {
    this.urlFormArrayTestGroup.push(new FormGroup<ContentUrl>({
      url: new FormControl<string>(urlObj?.url ?? '', [
        ...this.formValidationService.requiredFieldValidation,
        RxwebValidators.url()
      ]),
      description: new FormControl<string>(urlObj?.description ?? '', [
        ...this.formValidationService.requiredFieldValidation,
        RxwebValidators.maxLength({
          value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
        })
      ])
    }));
  }

  removeMediaCtrlAndValidate(ctrl: FormControl | undefined): void {
    if (ctrl) {
      ctrl.reset();
      this.testGroup.patchValue({
        isPublished: false
      })
    }
  }


  categoryChangeReaction(_: (TagCategoryEnum | 'NONE')[]): void {
    const oldCat = _[0];
    const dialogData: GenericDialogPrompt = {
      title: 'Change Category?',
      desc: `This will reset the selected Test Single list. Are you sure?`,
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-primary'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((res) => {
      const {category, subCategory} = this.testGroup.controls;
      if (res) {
        subCategory.reset();
        this.uiStore.patchState({
          selectedTests: []
        });
      } else {
        category.setValue(oldCat, {
          emitEvent: false
        });
      }
    });
  }

  trackByFn(index: number, test: Test): number {
    return test.id;
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
    const catData: TestSelectorData = {
      type: ContentSelectorOpType.SINGLE,
      category: this.testGroup.value.category
    };
    this.matDialog.open(TestSelectorComponent, {
      data: catData,
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

  deleteSelectedTestPrompt(test: Test): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Remove Test?',
      desc: `Are you sure you want to remove this Test from Group?`,
      action: {
        posTitle: 'Yes',
        negTitle: 'No',
        type: 'mat-primary'
      }
    };
    const dialogRef = this.matDialog.open(PromptDialogComponent, {
      data: dialogData,
      minWidth: '25rem'
    });
    dialogRef.afterClosed().subscribe((proceed: boolean) => {
      if (proceed) {
        if (this.selectedTests.find(value => value.id === test.id)) {
          this.uiStore.patchState({
            selectedTests: [
              ...this.selectedTests.filter(t => t.id !== test.id)
            ]
          });
        }
      }
    });
  }

  testGroupDragEvent($event: CdkDragDrop<Test>): void {
    const selectedTests: Test[] = this.selectedTests ? [...this.selectedTests] : [];
    moveItemInArray(selectedTests, $event.previousIndex, $event.currentIndex);
    this.uiStore.patchState({
      selectedTests
    });
  }

  selectedResource(i: number): Media | undefined {
    try {
      return this.selectedTestGroup?.imagesAndPdfs[i];
    } catch {
      return;
    }
  }

  private populateTest(testGroup: TestGroup): void {
    const {
      isVisible,
      category,
      imageId,
      thumbnailId,
      subCategory,
      name,
      description,
      overviewText,
      video
    } = testGroup;
    this.selectedTestGroup = testGroup;
    const selectedTests: Test[] = (testGroup.tests as Test[]) ?? [];
    1
    const resources: Media[] = this.selectedTestGroup.imagesAndPdfs as Media[] ?? [];
    const urls: ContentUrl[] = this.selectedTestGroup.ContentUrl as ContentUrl[] ?? [];
    this.testGroup.controls.category.setValue(category);
    this.uiStore.patchState({
      selectedTests
    });
    try {
      urls.forEach(u => this.addUrlCtrlTestGroup(u));
      resources.forEach(r => this.addResourceCtrl(r.id));
    } catch {
      this.hotToastService.error('URL/Resource population error');
    }
    this.testGroup.patchValue({
      isVisible,
      imageId,
      videoId: video?.id,
      overviewText,
      thumbnailId,
      subCategory,
      name,
      description
    });
    this.testGroup.updateValueAndValidity();
    this.cdr.markForCheck();
  }
}
