import { Injectable } from '@angular/core';
import {
  DistanceTypeEnum,
  PointTypeEnum, PointTypeEnumNumber,
  ProfileInputTypeUnitEnum,
  TagTypeEnum,
  WeightTypeEnum
} from '@hidden-innovation/shared/models';
import { TitleCasePipe } from '@angular/common';
import { FormControl, FormGroup, ValidatorFn } from '@ngneat/reactive-forms';
import {
  InputField,
  InputFieldExtended,
  MultipleChoiceField,
  MultipleChoiceFieldExtended,
  OneRMField,
  OneRMFieldExtended
} from '../models/input.interface';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Tag } from '@hidden-innovation/tags/data-access';
import { FormValidationService } from '@hidden-innovation/shared/form-config';

interface SixInputFields {
  zero: InputFieldExtended;
  one: InputFieldExtended;
  two: InputFieldExtended;
  three: InputFieldExtended;
  four: InputFieldExtended;
  five: InputFieldExtended;
  hp: InputFieldExtended;
}

@Injectable()
export class TestUtilitiesService {

  testTags: Tag[] = [];

  requiredFieldValidation: ValidatorFn[] = [
    RxwebValidators.required(),
    RxwebValidators.notEmpty()
  ];

  constructor(
    private titleCasePipe: TitleCasePipe,
    private formValidationService: FormValidationService
  ) {
  }

  resetTagsState(): void {
    this.testTags = [];
  }

  removeTypeTags(cat: TagTypeEnum): void {
    this.testTags = [
      ...this.testTags.filter(t => t.tagType !== cat)
    ];
  }

  toDateTime(secs: number) {
    const t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t;
  }

  removeTag(tag: Tag): void {
    if (this.testTags.includes(tag)) {
      this.testTags = [
        ...this.testTags.filter(t => t.id !== tag.id)
      ];
    }
  }

  updateTestTags(cat: TagTypeEnum, newTag: Tag) {
    this.testTags = [
      ...this.testTags,
      newTag
    ];
  }

  getUnitAbbreviation(unit: WeightTypeEnum | DistanceTypeEnum | ProfileInputTypeUnitEnum | string): string {
    const transUnit = this.titleCasePipe.transform(unit);
    switch (unit) {
      case DistanceTypeEnum.MILLIMETRE:
        return transUnit + ' (mm)';
      case DistanceTypeEnum.CENTIMETRE:
        return transUnit + ' (cm)';
      case (DistanceTypeEnum.METRE || ProfileInputTypeUnitEnum.METRE):
        return transUnit + ' (m)';
      case DistanceTypeEnum.KILOMETRE:
        return transUnit + ' (km)';
      case WeightTypeEnum.MILLIGRAM:
        return transUnit + ' (mg)';
      case WeightTypeEnum.GRAM:
        return transUnit + ' (g)';
      case (WeightTypeEnum.KILOGRAM || ProfileInputTypeUnitEnum.KILOGRAM):
        return transUnit + ' (kg)';
      case ProfileInputTypeUnitEnum.YEAR:
        return transUnit + ' (yr)';
      default:
        return transUnit;
    }
  }

  getPointLabel(point: number): string {
    if (point === PointTypeEnumNumber.HP) {
      return 'HP Threshold';
    }
    if (point === PointTypeEnumNumber.FIVE) {
      return point + ' points (Optimal)';
    }
    return point + ' points';
  }

  buildCorePointFormCtrl(type: PointTypeEnum): { pointType: FormControl<PointTypeEnum>; point: FormControl<number> } {
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

  buildInputFieldsForm(coreValidation: ValidatorFn[], typeValidation: ValidatorFn, inputData?: SixInputFields | undefined): FormGroup<InputField>[] {
    return [
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        low: new FormControl(inputData?.zero?.low ?? undefined, coreValidation),
        high: new FormControl(inputData?.zero?.high ?? undefined, coreValidation)
      }, {
        validators: typeValidation
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        low: new FormControl(inputData?.one?.low ?? undefined),
        high: new FormControl(inputData?.one?.high ?? undefined)
      }, {
        validators: typeValidation
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        low: new FormControl(inputData?.two?.low ?? undefined),
        high: new FormControl(inputData?.two?.high ?? undefined)
      }, {
        validators: typeValidation
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        low: new FormControl(inputData?.three?.low ?? undefined),
        high: new FormControl(inputData?.three?.high ?? undefined)
      }, {
        validators: typeValidation
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        low: new FormControl(inputData?.four?.low ?? undefined),
        high: new FormControl(inputData?.four?.high ?? undefined)
      }, {
        validators: typeValidation
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        low: new FormControl(inputData?.five?.low ?? undefined,coreValidation),
        high: new FormControl(inputData?.five?.high ?? undefined, coreValidation)
      }, {
        validators: typeValidation
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.HP),
        low: new FormControl(inputData?.hp?.low ?? undefined),
        high: new FormControl(inputData?.hp?.high ?? undefined)
      }, {
        validators: typeValidation
      })
    ];
  }

  buildMultiChoiceForm(data?: MultipleChoiceFieldExtended[]): FormGroup<MultipleChoiceField>[] {
    const answerValidation = [
      RxwebValidators.required(),
      RxwebValidators.notEmpty(),
      RxwebValidators.maxLength({
        value:150,
        message: 'Answer cannot be more than 150 characters'
      }),
    ];
    let editObj: {
      zero: MultipleChoiceFieldExtended,
      one: MultipleChoiceFieldExtended,
      two: MultipleChoiceFieldExtended,
      three: MultipleChoiceFieldExtended,
      four: MultipleChoiceFieldExtended,
      five: MultipleChoiceFieldExtended,
      hp: MultipleChoiceFieldExtended,
    } | undefined;
    if (data && data.length) {
      editObj = {
        zero: data[data.findIndex(f => f.pointType === PointTypeEnum.ZERO)],
        one: data[data.findIndex(f => f.pointType === PointTypeEnum.ONE)],
        two: data[data.findIndex(f => f.pointType === PointTypeEnum.TWO)],
        three: data[data.findIndex(f => f.pointType === PointTypeEnum.THREE)],
        four: data[data.findIndex(f => f.pointType === PointTypeEnum.FOUR)],
        five: data[data.findIndex(f => f.pointType === PointTypeEnum.FIVE)],
        hp: data[data.findIndex(f => f.pointType === PointTypeEnum.HP)]
      };
    }
    return [
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        answer: new FormControl<string>(editObj?.zero?.answer ?? '', answerValidation)
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        answer: new FormControl<string>(editObj?.one?.answer ?? '')
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        answer: new FormControl<string>(editObj?.two?.answer ?? '')
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        answer: new FormControl<string>(editObj?.three?.answer ?? '')
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        answer: new FormControl<string>(editObj?.four?.answer ?? '')
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        answer: new FormControl<string>(editObj?.five?.answer ?? '',answerValidation)
      }),
      new FormGroup<MultipleChoiceField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.HP),
        answer: new FormControl<string>(editObj?.hp?.answer ?? '')
      })
    ];

  }

  buildTimeForm(data?: InputFieldExtended[], inverse?: boolean): FormGroup<InputField>[] {
    const coreValidations = [
      ...this.requiredFieldValidation
    ];
    let editObj: SixInputFields | undefined;
    let timeParsedData: InputFieldExtended[] = [];
    if (data && data.length) {
      timeParsedData = [
        ...data.map(f => {
          return {
            ...f,
            low: this.toDateTime((f.low as number) ?? 0),
            high: this.toDateTime((f.high as number) ?? 0)
          };
        })
      ];
      editObj = {
        zero: timeParsedData[timeParsedData.findIndex(f => f.pointType === PointTypeEnum.ZERO)],
        one: timeParsedData[timeParsedData.findIndex(f => f.pointType === PointTypeEnum.ONE)],
        two: timeParsedData[timeParsedData.findIndex(f => f.pointType === PointTypeEnum.TWO)],
        three: timeParsedData[timeParsedData.findIndex(f => f.pointType === PointTypeEnum.THREE)],
        four: timeParsedData[timeParsedData.findIndex(f => f.pointType === PointTypeEnum.FOUR)],
        five: timeParsedData[timeParsedData.findIndex(f => f.pointType === PointTypeEnum.FIVE)],
        hp: timeParsedData[timeParsedData.findIndex(f => f.pointType === PointTypeEnum.HP)]
      };
    }
    return this.buildInputFieldsForm(coreValidations, this.formValidationService.greaterTimeLowHigh(inverse), editObj);
  }

  buildCommonPointFormGroup(data?: InputFieldExtended[], inverse?: boolean): FormGroup<InputField>[] {
    const coreValidations = [
      ...this.requiredFieldValidation,
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      }),
    ];
    let editObj: SixInputFields | undefined;
    if (data && data.length) {
      editObj = {
        zero: data[data.findIndex(f => f.pointType === PointTypeEnum.ZERO)],
        one: data[data.findIndex(f => f.pointType === PointTypeEnum.ONE)],
        two: data[data.findIndex(f => f.pointType === PointTypeEnum.TWO)],
        three: data[data.findIndex(f => f.pointType === PointTypeEnum.THREE)],
        four: data[data.findIndex(f => f.pointType === PointTypeEnum.FOUR)],
        five: data[data.findIndex(f => f.pointType === PointTypeEnum.FIVE)],
        hp: data[data.findIndex(f => f.pointType === PointTypeEnum.HP)]
      };
    }
    return this.buildInputFieldsForm(coreValidations, this.formValidationService.greaterLowHigh(inverse), editObj);
  }

  buildOneRemForm(data?: OneRMFieldExtended[], inverse?: boolean): FormGroup<OneRMField>[] {
    const coreValidations = [
      ...this.requiredFieldValidation,
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      })
    ];
    let editObj: { zero: OneRMFieldExtended, one: OneRMFieldExtended, two: OneRMFieldExtended, three: OneRMFieldExtended, four: OneRMFieldExtended, five: OneRMFieldExtended, hp: OneRMFieldExtended } | undefined;
    if (data && data.length) {
      editObj = {
        zero: data[data.findIndex(f => f.pointType === PointTypeEnum.ZERO)],
        one: data[data.findIndex(f => f.pointType === PointTypeEnum.ONE)],
        two: data[data.findIndex(f => f.pointType === PointTypeEnum.TWO)],
        three: data[data.findIndex(f => f.pointType === PointTypeEnum.THREE)],
        four: data[data.findIndex(f => f.pointType === PointTypeEnum.FOUR)],
        five: data[data.findIndex(f => f.pointType === PointTypeEnum.FIVE)],
        hp: data[data.findIndex(f => f.pointType === PointTypeEnum.HP)]
      };
    }
    return [
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        low: new FormControl(editObj?.zero?.low ?? undefined, coreValidations),
        high: new FormControl(editObj?.zero?.high ?? undefined, coreValidations)
      }, {
        validators: this.formValidationService.greaterLowHigh(inverse)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        low: new FormControl(editObj?.one?.low ?? undefined),
        high: new FormControl(editObj?.one?.high ?? undefined)
      }, {
        validators: this.formValidationService.greaterLowHigh(inverse)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        low: new FormControl(editObj?.two?.low ?? undefined),
        high: new FormControl(editObj?.two?.high ?? undefined)
      }, {
        validators: this.formValidationService.greaterLowHigh(inverse)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        low: new FormControl(editObj?.three?.low ?? undefined),
        high: new FormControl(editObj?.three?.high ?? undefined)
      }, {
        validators: this.formValidationService.greaterLowHigh(inverse)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        low: new FormControl(editObj?.four?.low ?? undefined),
        high: new FormControl(editObj?.four?.high ?? undefined)
      }, {
        validators: this.formValidationService.greaterLowHigh(inverse)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        low: new FormControl(editObj?.five?.low ?? undefined, coreValidations),
        high: new FormControl(editObj?.five?.high ?? undefined, coreValidations)
      }, {
        validators: this.formValidationService.greaterLowHigh(inverse)
      }),
      new FormGroup<OneRMField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.HP),
        low: new FormControl(editObj?.hp?.low ?? undefined),
        high: new FormControl(editObj?.hp?.high ?? undefined)
      }, {
        validators: this.formValidationService.greaterLowHigh(inverse)
      })
    ];
  }

}
