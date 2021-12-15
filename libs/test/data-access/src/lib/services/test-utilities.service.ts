import { Injectable } from '@angular/core';
import {
  DistanceTypeEnum,
  PointTypeEnum,
  ProfileInputTypeUnitEnum,
  TagTypeEnum,
  WeightTypeEnum
} from '@hidden-innovation/shared/models';
import { TitleCasePipe } from '@angular/common';
import { FormControl, FormGroup, ValidatorFn } from '@ngneat/reactive-forms';
import { InputField, MultipleChoiceField, OneRMField } from '../models/input.interface';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Tag } from '@hidden-innovation/tags/data-access';

@Injectable()
export class TestUtilitiesService {

  testTags: Tag[] = [];

  requiredFieldValidation: ValidatorFn[] = [
    RxwebValidators.required(),
    RxwebValidators.notEmpty()
  ];

  constructor(
    private titleCasePipe: TitleCasePipe
  ) {
  }

  removeTypeTags(cat: TagTypeEnum): void {
    this.testTags = [
      ...this.testTags.filter(t => t.tagType !== cat)
    ];
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

  buildInputFieldsForm(lowValidations: ValidatorFn[], highValidations: ValidatorFn[]): FormGroup<InputField>[] {
    return [
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ZERO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.ONE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.TWO),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.THREE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FOUR),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      }),
      new FormGroup<InputField>({
        ...this.buildCorePointFormCtrl(PointTypeEnum.FIVE),
        low: new FormControl(undefined, lowValidations),
        high: new FormControl(undefined, highValidations)
      })
    ];
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
      ...this.requiredFieldValidation,
      RxwebValidators.minDate({
        fieldName: 'high',
        operator: '>'
      })
    ];
    const highValidations = [
      ...this.requiredFieldValidation,
      RxwebValidators.maxDate({
        fieldName: 'low',
        operator: '<'
      })
    ];
    return this.buildInputFieldsForm(lowValidations, highValidations);
  }

  buildDistanceOrWeightOrRepsForm(): FormGroup<InputField>[] {
    const lowValidations = [
      ...this.requiredFieldValidation,
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      }),
      RxwebValidators.lessThan({
        fieldName: 'high'
      })
    ];
    const highValidations = [
      ...this.requiredFieldValidation,
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      }),
      RxwebValidators.greaterThan({
        fieldName: 'low'
      })
    ];
    return this.buildInputFieldsForm(lowValidations, highValidations);
  }

  buildOneRemForm(): FormGroup<OneRMField>[] {
    const lowValidations = [
      ...this.requiredFieldValidation,
      RxwebValidators.numeric({
        allowDecimal: true,
        acceptValue: NumericValueType.PositiveNumber
      }),
      RxwebValidators.lessThan({
        fieldName: 'high'
      })
    ];
    const highValidations = [
      ...this.requiredFieldValidation,
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

}
