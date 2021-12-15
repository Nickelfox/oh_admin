import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  DifficultyEnum,
  DistanceTypeEnum,
  ProfileInputEnum,
  ProfileInputTypeEnum,
  ProfileInputTypeUnitEnum,
  RatioTestTypeEnum,
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
  RatioSubObject,
  RelativeProfileObject,
  TestStore,
  TestUtilitiesService
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

export class TestCreateComponent {
  testInputTypeEnum = TestInputTypeEnum;
  tagTypeEnum = TagTypeEnum;
  aspectRatio = AspectRatio;
  tagCategoryEnum = TagCategoryEnum;
  distanceTypeEnum = DistanceTypeEnum;
  weightTypeEnum = WeightTypeEnum;
  ratioTestTypeEnum = RatioTestTypeEnum;

  testInputTypeIte = Object.values(TestInputTypeEnum).map(value => value.toString());
  testCatTypeIte = Object.values(TagCategoryEnum).map(value => value.toString());
  diffTypeIte = Object.values(DifficultyEnum).map(value => value.toString());
  ratioTestTypeIte = Object.values(RatioTestTypeEnum).map(value => value.toString());
  weightTypeIte = Object.values(WeightTypeEnum).map(value => value.toString());
  distTypeIte = Object.values(DistanceTypeEnum).map(value => value.toString());
  profileInputIte = Object.values(ProfileInputEnum).map(value => value.toString());
  profileInputTypeIte = Object.values(ProfileInputTypeEnum).map(value => value.toString());
  profileInputTypeUnitIte = Object.values(ProfileInputTypeUnitEnum).map(value => value.toString());

  @ViewChild('tagsInput') tagsInput?: ElementRef<HTMLInputElement>;

  testGroup: FormGroup<CreateTest> = new FormGroup<CreateTest>({
    name: new FormControl('', [...this.utilities.requiredFieldValidation]),
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
    label: new FormControl('', [...this.utilities.requiredFieldValidation]),
    description: new FormControl('', [...this.utilities.requiredFieldValidation]),
    outcomes: new FormControl('', [...this.utilities.requiredFieldValidation]),
    procedure: new FormControl('', [...this.utilities.requiredFieldValidation]),
    needEquipment: new FormControl(false),
    equipment: new FormControl({ value: '', disabled: true }, [...this.utilities.requiredFieldValidation]),
    tags: new FormControl([]),
    difficulty: new FormControl(DifficultyEnum.BEGINNER, [...this.utilities.requiredFieldValidation]),
    inputType: new FormControl('NONE'),
    resultExplanation: new FormControl({
      value: '',
      disabled: true
    }, [...this.utilities.requiredFieldValidation]),
    isPublished: new FormControl(false),
    oneRMInputFields: new FormArray<OneRMField>([], [
      this.formValidationService.greaterPointValidator()
    ]),
    reps: new FormGroup({
      oneRep: new FormControl<boolean>(false),
      threeRep: new FormControl<boolean>(false),
      fiveRep: new FormControl<boolean>(false)
    }, [...this.utilities.requiredFieldValidation]),
    multipleChoiceQuestion: new FormControl<string>({
      value: '',
      disabled: true
    }, [...this.utilities.requiredFieldValidation]),
    multipleChoiceInputFields: new FormArray<MultipleChoiceField>([]),
    distanceUnit: new FormControl({
      value: undefined,
      disabled: true
    }, [...this.utilities.requiredFieldValidation]),
    weightUnit: new FormControl({
      value: undefined,
      disabled: true
    }, [...this.utilities.requiredFieldValidation]),
    inputFields: new FormArray<InputField>([]),
    customNumericLabel: new FormControl({
      value: '',
      disabled: true
    }, [...this.utilities.requiredFieldValidation]),
    ratioVariable: new FormGroup<RatioSubObject>({
      xType: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation]),
      yType: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation]),
      xLabel: new FormControl({ value: '', disabled: true }, [
        ...this.utilities.requiredFieldValidation,
        RxwebValidators.minLength({
          value: 1
        }),
        RxwebValidators.maxLength({
          value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
        })
      ]),
      yLabel: new FormControl({ value: '', disabled: true }, [
        ...this.utilities.requiredFieldValidation,
        RxwebValidators.minLength({
          value: 1
        }),
        RxwebValidators.maxLength({
          value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
        })
      ]),
      xWeightUnit: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation]),
      yWeightUnit: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation]),
      xDistanceUnit: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation]),
      yDistanceUnit: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation])
    }),
    relativeProfile: new FormGroup<RelativeProfileObject>({
      profileInput: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation]),
      inputType: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation]),
      unit: new FormControl({
        value: undefined,
        disabled: true
      }, [...this.utilities.requiredFieldValidation]),
      label: new FormControl({ value: '', disabled: true }, [
        ...this.utilities.requiredFieldValidation,
        RxwebValidators.minLength({
          value: 1
        }),
        RxwebValidators.maxLength({
          value: this.formValidationService.FIELD_VALIDATION_VALUES.NAME_LENGTH
        })
      ])
    })
  });

  constructor(
    public formValidationService: FormValidationService,
    public constantDataService: ConstantDataService,
    private hotToastService: HotToastService,
    private store: TestStore,
    public utilities: TestUtilitiesService
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
      weightUnit,
      customNumericLabel,
      ratioVariable,
      relativeProfile
    } = this.testGroup.controls;
    needEquipment.valueChanges.subscribe(isActive => isActive ? equipment.enable() : equipment.disable());
    oneRMInputFields.valueChanges.subscribe(_ => this.validatePublishedState());
    inputFields.valueChanges.subscribe(_ => this.validatePublishedState());
    multipleChoiceInputFields.valueChanges.subscribe(_ => this.validatePublishedState());
    const ratioGroup: FormGroup<RatioSubObject> = ratioVariable as FormGroup<RatioSubObject>;
    const relativeGroup: FormGroup<RelativeProfileObject> = relativeProfile as FormGroup<RelativeProfileObject>;
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
      customNumericLabel.disable();
      multipleChoiceQuestion.disable();
      ratioGroup.disable();
      relativeGroup.disable();
      this.validatePublishedState();
      switch (type) {
        case TestInputTypeEnum.DISTANCE:
          this.utilities.buildDistanceOrWeightOrRepsForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterPointValidator()]);
          distanceUnit.enable();
          break;
        case TestInputTypeEnum.CUSTOM_NUMERIC:
          this.utilities.buildDistanceOrWeightOrRepsForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterPointValidator()]);
          customNumericLabel.enable();
          break;
        case TestInputTypeEnum.WEIGHT:
          this.utilities.buildDistanceOrWeightOrRepsForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterPointValidator()]);
          weightUnit.enable();
          break;
        case TestInputTypeEnum.ONE_RM:
          this.utilities.buildOneRemForm().map(fg => oneRMFArray.push(fg));
          reps.enable();
          resultExplanation.enable();
          break;
        case TestInputTypeEnum.MULTIPLE_CHOICE:
          this.utilities.buildMultiChoiceForm().map(fg => mCArray.push(fg));
          multipleChoiceQuestion.enable();
          break;
        case TestInputTypeEnum.TIME:
          this.utilities.buildTimeForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterTimeValidator()]);
          break;
        case TestInputTypeEnum.REPS:
          this.utilities.buildDistanceOrWeightOrRepsForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterPointValidator()]);
          break;
        case TestInputTypeEnum.RATIO:
          ratioGroup.enable();
          this.utilities.buildDistanceOrWeightOrRepsForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterPointValidator()]);
          break;
        case TestInputTypeEnum.RELATIVE_PROFILE:
          relativeGroup.enable();
          this.utilities.buildDistanceOrWeightOrRepsForm().map(fg => inputFArray.push(fg));
          inputFArray.addValidators([this.formValidationService.greaterPointValidator()]);
          break;
      }
    });
    category.valueChanges.subscribe(_ => {
      this.utilities.removeTypeTags(TagTypeEnum.SUB_CATEGORY);
      this.updateTagControl();
    });
    const { xWeightUnit, xDistanceUnit, yWeightUnit, yDistanceUnit, xType, yType } = ratioGroup.controls;
    xType.valueChanges.subscribe((type) => {
      switch (type) {
        case RatioTestTypeEnum.DISTANCE_LENGTH:
          xWeightUnit.disable({
            emitEvent: false
          });
          xDistanceUnit.enable({
            emitEvent: false
          });
          break;
        case RatioTestTypeEnum.WEIGHT:
          xDistanceUnit.disable({
            emitEvent: false
          });
          xWeightUnit.enable({
            emitEvent: false
          });
          break;
        default:
          xDistanceUnit.disable({
            emitEvent: false
          });
          xWeightUnit.disable({
            emitEvent: false
          });
      }
    });
    yType.valueChanges.subscribe((type) => {
      switch (type) {
        case RatioTestTypeEnum.DISTANCE_LENGTH:
          yWeightUnit.disable({
            emitEvent: false
          });
          yDistanceUnit.enable({
            emitEvent: false
          });
          break;
        case RatioTestTypeEnum.WEIGHT:
          yDistanceUnit.disable({
            emitEvent: false
          });
          yWeightUnit.enable({
            emitEvent: false
          });
          break;
        default:
          yDistanceUnit.disable({
            emitEvent: false
          });
          yWeightUnit.disable({
            emitEvent: false
          });
      }
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

  get ratioVariableFormGroup(): FormGroup<RatioSubObject> | undefined {
    return this.testGroup.controls.ratioVariable as FormGroup<RatioSubObject>;
  }

  get profileInputFormGroup(): FormGroup<RelativeProfileObject> | undefined {
    return this.testGroup.controls.relativeProfile as FormGroup<RelativeProfileObject>;
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

  updateTagControl(): void {
    this.testGroup.controls.tags.setValue(
      [...this.utilities.testTags.map(t => t.id)]
    );
  }

  updateTestTags(cat: TagTypeEnum, newTag: Tag) {
    this.utilities.updateTestTags(cat, newTag);
    this.updateTagControl();
  }

  removeTag(tag: Tag) {
    this.utilities.removeTag(tag);
    this.updateTagControl();
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
