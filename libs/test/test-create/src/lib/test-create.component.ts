import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  DifficultyEnum,
  DistanceTypeEnum,
  PointTypeEnum,
  TagCategoryEnum,
  TagTypeEnum,
  TestInputTypeEnum,
  WeightTypeEnum
} from '@hidden-innovation/shared/models';
import { Tag } from '@hidden-innovation/tags/data-access';
import {
  CreateTest,
  InputField,
  MultipleChoiceField,
  OneRMField,
  TestStore
} from '@hidden-innovation/test/data-access';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { AspectRatio } from '@hidden-innovation/media';
import { HotToastService } from '@ngneat/hot-toast';
import { DateTime } from 'luxon';


@Component({
  selector: 'hidden-innovation-test-create',
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestCreateComponent implements OnInit {
  testTags: Tag[] = [];

  testInputTypeEnum = TestInputTypeEnum;
  tagTypeEnum = TagTypeEnum;
  aspectRatio = AspectRatio;
  tagCategoryEnum = TagCategoryEnum;
  distanceTypeEnum = DistanceTypeEnum;
  weightTypeEnum = WeightTypeEnum;

  testInputTypeIte = Object.values(TestInputTypeEnum).map(value => value.toString());
  testCatTypeIte = Object.values(TagCategoryEnum).map(value => value.toString());
  diffTypeIte = Object.values(DifficultyEnum).map(value => value.toString());

  @ViewChild('tagsInput') tagsInput?: ElementRef<HTMLInputElement>;

  testGroup: FormGroup<CreateTest> = new FormGroup<CreateTest>({
    name: new FormControl('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    category: new FormControl(undefined),
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
    posterId: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.numeric({
        allowDecimal: false,
        acceptValue: NumericValueType.PositiveNumber
      })
    ]),
    label: new FormControl('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    description: new FormControl('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    outcomes: new FormControl('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    procedure: new FormControl('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    needEquipment: new FormControl(false),
    equipment: new FormControl({ value: '', disabled: true }, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    tags: new FormControl([]),
    difficulty: new FormControl(DifficultyEnum.BEGINNER, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    inputType: new FormControl('NONE'),
    resultExplanation: new FormControl({ value: '', disabled: true }, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    isPublished: new FormControl(false),
    oneRMInputFields: new FormArray<OneRMField>([], [
      this.formValidationService.greaterPointValidator()
    ]),
    reps: new FormGroup({
      oneRep: new FormControl<boolean>(false),
      threeRep: new FormControl<boolean>(false),
      fiveRep: new FormControl<boolean>(false)
    }, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    multipleChoiceQuestion: new FormControl<string>({ value: '', disabled: true }, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    multipleChoiceInputFields: new FormArray<MultipleChoiceField>([]),
    distanceUnit: new FormControl({ value: undefined, disabled: true }, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    weightUnit: new FormControl({ value: undefined, disabled: true }, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    inputFields: new FormArray<InputField>([])
  });

  constructor(
    public formValidationService: FormValidationService,
    public constantDataService: ConstantDataService,
    private hotToastService: HotToastService,
    private store: TestStore
  ) {
    const {
      needEquipment,
      equipment,
      distanceUnit,
      resultExplanation,
      reps,
      inputType,
      category,
      oneRMInputFields,
      multipleChoiceQuestion,
      multipleChoiceInputFields,
      inputFields,
      weightUnit
    } = this.testGroup.controls;
    needEquipment.valueChanges.subscribe(isActive => isActive ? equipment.enable() : equipment.disable());
    oneRMInputFields.valueChanges.subscribe(_ => this.validatePublishedState());
    inputFields.valueChanges.subscribe(_ => this.validatePublishedState());
    multipleChoiceInputFields.valueChanges.subscribe(_ => this.validatePublishedState());
    inputType.valueChanges.subscribe(type => {
      const oneRMFArray: FormArray<OneRMField> = oneRMInputFields as FormArray<OneRMField>;
      const mCArray: FormArray<MultipleChoiceField> = multipleChoiceInputFields as FormArray<MultipleChoiceField>;
      const inputFArray: FormArray<InputField> = inputFields as FormArray<InputField>;
      oneRMFArray.clear();
      mCArray.clear();
      inputFArray.clear();
      inputFArray.removeValidators([]);
      reps.disable();
      resultExplanation.disable();
      distanceUnit.disable();
      weightUnit.disable();
      multipleChoiceQuestion.disable();
      this.validatePublishedState();
      switch (type) {
        case TestInputTypeEnum.DISTANCE:
          this.buildDistanceOrWeightForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterPointValidator()]);
          distanceUnit.enable();
          break;
        case TestInputTypeEnum.WEIGHT:
          this.buildDistanceOrWeightForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterPointValidator()]);
          weightUnit.enable();
          break;
        case TestInputTypeEnum.ONE_RM:
          this.buildOneRemForm().map(fg => oneRMFArray.push(fg));
          reps.enable();
          resultExplanation.enable();
          break;
        case TestInputTypeEnum.MULTIPLE_CHOICE:
          this.buildMultiChoiceForm().map(fg => mCArray.push(fg));
          multipleChoiceQuestion.enable();
          break;
        case TestInputTypeEnum.TIME:
          this.buildTimeForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterTimeValidator()]);
          break;
      }
    });
    category.valueChanges.subscribe(cat => {
      this.testTags = [
        ...this.testTags.filter(t => t.tagType !== TagTypeEnum.SUB_CATEGORY)
      ];
      this.updateTagControl(this.testTags);
    });
  }

  get oneRMInputFieldFormArray(): FormArray<OneRMField> {
    return this.testGroup.controls.oneRMInputFields as FormArray<OneRMField>;
  }

  get mcRMInputFieldFormArray(): FormArray<MultipleChoiceField> {
    return this.testGroup.controls.multipleChoiceInputFields as FormArray<MultipleChoiceField>;
  }

  get inputFieldFormArray(): FormArray<InputField> {
    return this.testGroup.controls.inputFields as FormArray<InputField>;
  }

  validatePublishedState(): void {
    const {
      inputType,
      oneRMInputFields,
      multipleChoiceInputFields,
      inputFields,
      isPublished
    } = this.testGroup.controls;
    const isInputTypeValid = (inputType.valid && inputType.value !== 'NONE');
    const isOneRemValid = (oneRMInputFields.valid && !!(oneRMInputFields.value?.length)) || oneRMInputFields.disabled;
    const isInputValid = (inputFields.valid && !!(inputFields.value?.length)) || inputFields.disabled;
    const isMChoiceValid = (multipleChoiceInputFields.valid && !!(multipleChoiceInputFields.value?.length)) || multipleChoiceInputFields.disabled;
    if (isInputTypeValid) {
      isPublished.setValue(true);
    } else {
      isPublished.setValue(false);
      return;
    }
    switch (inputType.value) {
      case TestInputTypeEnum.ONE_RM:
        if (isOneRemValid) {
          isPublished.setValue(true);
        } else {
          isPublished.setValue(false);
        }
        break;
      case TestInputTypeEnum.MULTIPLE_CHOICE:
        if (isMChoiceValid) {
          isPublished.setValue(true);
        } else {
          isPublished.setValue(false);
        }
        break;
      default :
        if (isInputValid) {
          isPublished.setValue(true);
        } else {
          isPublished.setValue(false);
        }
    }

  }

  getOneRMInputFieldGroup(i: number): FormGroup<OneRMField> {
    return this.oneRMInputFieldFormArray.controls[i] as FormGroup<OneRMField>;
  }

  mcRMInputFieldFieldGroup(i: number): FormGroup<MultipleChoiceField> {
    return this.mcRMInputFieldFormArray.controls[i] as FormGroup<MultipleChoiceField>;
  }

  inputFieldGroup(i: number): FormGroup<InputField> {
    return this.inputFieldFormArray.controls[i] as FormGroup<InputField>;
  }

  ngOnInit(): void {
  }

  updateTagControl(tags: Tag[]): void {
    this.testGroup.controls.tags.setValue(
      [...tags.map(t => t.id)]
    );
  }

  updateTestTags(cat: TagTypeEnum, newTag: Tag) {
    this.testTags = [
      ...this.testTags,
      newTag
    ];
    this.updateTagControl(this.testTags);
  }

  removeTag(tag: Tag) {
    if (this.testTags.includes(tag)) {
      this.testTags = [
        ...this.testTags.filter(t => t.id !== tag.id)
      ];
      this.updateTagControl(this.testTags);
    }
  }

  buildCorePointFormCtrl(type: PointTypeEnum): { pointType: FormControl<PointTypeEnum>; point: FormControl<number | string> } {
    let pointVal;
    switch (type) {
      case PointTypeEnum.ZERO:
        pointVal = 0;
        break;
      case PointTypeEnum.ONE:
        pointVal = 1;
        break;
      case PointTypeEnum.TWO:
        pointVal = 2;
        break;
      case PointTypeEnum.THREE:
        pointVal = 3;
        break;
      case PointTypeEnum.FOUR:
        pointVal = 4;
        break;
      case PointTypeEnum.FIVE:
        pointVal = 5;
        break;
      case PointTypeEnum.HP:
        pointVal = 6;
        break;
    }
    return {
      pointType: new FormControl<PointTypeEnum>(type),
      point: new FormControl(pointVal)
    };
  }

  buildMultiChoiceForm(): FormGroup<MultipleChoiceField>[] {
    const answerValidation = [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ];
    return [
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        answer: new FormControl<string>('', answerValidation)
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        answer: new FormControl<string>('', answerValidation)
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        answer: new FormControl<string>('', answerValidation)
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        answer: new FormControl<string>('', answerValidation)
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        answer: new FormControl<string>('', answerValidation)
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        answer: new FormControl<string>('', answerValidation)
      })
    ];
  }

  buildTimeForm(): FormGroup<InputField>[] {
    const lowValidations = [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.minDate({
        fieldName: 'high',
        operator: '>'
      })
    ];
    const highValidations = [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.maxDate({
        fieldName: 'low',
        operator: '<'
      })
    ];
    return [
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      })
    ];
  }

  buildDistanceOrWeightForm(): FormGroup<InputField>[] {
    const lowValidations = [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      }),
      RxwebValidators.lessThan({
        fieldName: 'high'
      })
    ];
    const highValidations = [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      }),
      RxwebValidators.greaterThan({
        fieldName: 'low'
      })
    ];
    return [
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      })
    ];
  }

  buildOneRemForm(): FormGroup<OneRMField>[] {
    const lowValidations = [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      }),
      RxwebValidators.lessThan({
        fieldName: 'high'
      })
    ];
    const highValidations = [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      }),
      RxwebValidators.greaterThan({
        fieldName: 'low'
      })
    ];
    return [
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.HP),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      })
    ];
  }

  submit(): void {
    this.testGroup.markAllAsDirty();
    this.testGroup.markAllAsTouched();
    if (this.testGroup.invalid) {
      this.hotToastService.error(this.formValidationService.formSubmitError);
      return;
    }
    if (this.testGroup.value.inputType === TestInputTypeEnum.TIME) {
      let testObj = this.testGroup.value;
      testObj = {
        ...testObj,
        inputFields: testObj.inputFields.map(fields => {
          const low = DateTime.fromJSDate(fields.low as Date).toSeconds();
          const high = DateTime.fromJSDate(fields.high as Date).toSeconds();
          return {
            ...fields,
            low,
            high
          };
        })
      };
      this.store.createTest$({ ...testObj });
    } else {
      this.store.createTest$(this.testGroup.value);
    }
  }

}
