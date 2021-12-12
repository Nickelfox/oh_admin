import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  DifficultyEnum,
  PointTypeEnum,
  TagCategoryEnum,
  TagTypeEnum,
  TestInputTypeEnum
} from '@hidden-innovation/shared/models';
import { Tag } from '@hidden-innovation/tags/data-access';
import { CreateTest, MultipleChoiceField, OneRMInputField } from '@hidden-innovation/test/data-access';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { AspectRatio } from '@hidden-innovation/media';


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
    inputType: new FormControl('NONE', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    distanceUnit: new FormControl(undefined, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    resultExplanation: new FormControl('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    isPublished: new FormControl(true),
    oneRMInputFields: new FormArray<OneRMInputField>([], [
      this.formValidationService.oneRemGreaterPointValidator()
    ]),
    reps: new FormGroup({
      oneRep: new FormControl<boolean>(false),
      threeRep: new FormControl<boolean>(false),
      fiveRep: new FormControl<boolean>(false)
    }, [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    multipleChoiceQuestion: new FormControl<string>('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    multipleChoiceInputFields: new FormArray<MultipleChoiceField>([])
  });

  constructor(
    public formValidationService: FormValidationService,
    public constantDataService: ConstantDataService
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
      multipleChoiceInputFields
    } = this.testGroup.controls;
    needEquipment.valueChanges.subscribe(isActive => {
      isActive ? equipment.enable() : equipment.disable();
    });
    inputType.valueChanges.subscribe(type => {
      const oneRMFArray: FormArray<OneRMInputField> = oneRMInputFields as FormArray<OneRMInputField>;
      const mCArray: FormArray<MultipleChoiceField> = multipleChoiceInputFields as FormArray<MultipleChoiceField>;
      oneRMFArray.clear();
      reps.disable();
      resultExplanation.disable();
      distanceUnit.disable();
      multipleChoiceQuestion.disable();
      switch (type) {
        case TestInputTypeEnum.DISTANCE:
          distanceUnit.enable();
          break;
        case TestInputTypeEnum.ONE_RM:
          this.buildOneRemForm().map(fg => oneRMFArray.push(fg));
          reps.enable();
          resultExplanation.enable();
          break;
        case TestInputTypeEnum.MULTIPLE_CHOICE:
          this.buildMultiChoiceForm().map(fg => mCArray.push(fg));
          multipleChoiceQuestion.enable();
      }
    });
    category.valueChanges.subscribe(cat => {
      this.testTags = [
        ...this.testTags.filter(t => t.tagType !== TagTypeEnum.SUB_CATEGORY)
      ];
      this.updateTagControl(this.testTags);
    });
  }

  get oneRMInputFieldFormArray(): FormArray<OneRMInputField> {
    return this.testGroup.controls.oneRMInputFields as FormArray<OneRMInputField>;
  }

  get mcRMInputFieldFormArray(): FormArray<MultipleChoiceField> {
    return this.testGroup.controls.multipleChoiceInputFields as FormArray<MultipleChoiceField>;
  }

  getOneRMInputFieldGroup(i: number): FormGroup<OneRMInputField> {
    return this.oneRMInputFieldFormArray.controls[i] as FormGroup<OneRMInputField>;
  }

  mcRMInputFieldFieldGroup(i: number): FormGroup<MultipleChoiceField> {
    return this.mcRMInputFieldFormArray.controls[i] as FormGroup<MultipleChoiceField>;
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
        pointVal = 'HP';
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

  buildOneRemForm(): FormGroup<OneRMInputField>[] {
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
      new FormGroup<OneRMInputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMInputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMInputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMInputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMInputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMInputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<OneRMInputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.HP),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      })
    ];
  }

}
