import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Question } from '../models/questionnaire.interface';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { Validators } from '@angular/forms';
import { flattenDepth, max, min } from 'lodash-es';
import { AnswerCore, ImageSelectAnswer, MinMaxPoints, MultipleChoiceAnswer } from '../models/answer.interface';

@Injectable()
export class QuestionnaireUtilitiesService {

  constructor(
    private formValidationService: FormValidationService
  ) {
  }

  prefilledYesNoAnswer(): FormGroup<AnswerCore>[] {
    const yesNoData: string[] = ['Yes', 'No'];
    return yesNoData.map(value => new FormGroup<AnswerCore>({
      name: new FormControl<string>(value, [
        RxwebValidators.required(),
        RxwebValidators.notEmpty(),
        RxwebValidators.unique(),
      ]),
      point: new FormControl<number>(undefined, this.formValidationService.pointValidations)
    }));
  }

  buildQuestion(type: QuestionTypeEnum, questionData?: Question): FormGroup<Question> {
    let answer: FormGroup<AnswerCore>[] | undefined;
    if (!questionData && type === QuestionTypeEnum.YES_NO) {
      answer = this.prefilledYesNoAnswer();
    }
    const question: FormGroup<Question> = new FormGroup<Question>({
      name: new FormControl<string>(questionData?.name ?? '', [
        RxwebValidators.required(),
        RxwebValidators.notEmpty(),
      ]),
      questionType: new FormControl<QuestionTypeEnum>(type, [
        Validators.required
      ]),
      description: new FormControl<string>(questionData?.description ?? ''),
      whyAreWeAsking: new FormControl<boolean>(questionData?.whyAreWeAsking ?? false),
      whyAreWeAskingQuestion: new FormControl<string>({
        value: questionData?.whyAreWeAskingQuestion ?? '',
        disabled: !questionData?.whyAreWeAsking
      }, [
        RxwebValidators.required(),
        RxwebValidators.notEmpty()
      ]),
      showIcon: new FormControl<boolean>(questionData?.showIcon ?? false),
      omitScoring: new FormControl<boolean>(questionData?.omitScoring ?? false),
      answer: new FormArray<MultipleChoiceAnswer | AnswerCore>(answer ?? [], type !== QuestionTypeEnum.IMAGE_SELECT ? [
        Validators.required,
        Validators.minLength(2)
      ] : null),
      imageAnswer: new FormArray<ImageSelectAnswer>([], type === QuestionTypeEnum.IMAGE_SELECT ? [
        Validators.required,
        Validators.minLength(2)
      ] : null)
    });
    return question;
  }

  minMaxPoints(questionArray: FormArray): MinMaxPoints | undefined {
    let tempPoints: MinMaxPoints = {
      max: 0,
      min: 0
    };
    if (questionArray.length) {
      const answers: (MultipleChoiceAnswer[] | AnswerCore[])[] = questionArray.value.filter(value => !value.omitScoring)?.map(v => v.answer);
      const imageAnswer: (ImageSelectAnswer[])[] = questionArray.value.map(v => v.imageAnswer);
      const nestedPoints = answers.map(value => value.map(value1 => value1.point));
      const nestedImagePoints = imageAnswer.map(value => value.map(value1 => value1.point));
      const points: number[] = [...flattenDepth(nestedPoints, 1), ...flattenDepth(nestedImagePoints, 1)].map(value => typeof value === 'string' ? parseInt(value) : value);
      const maxPoint = max(points) !== null && max(points) !== undefined ? max(points) : 0;
      const minPoint = min(points) !== null && min(points) !== undefined ? min(points) : 0;
      tempPoints = {
        max: maxPoint,
        min: minPoint
      };
      return tempPoints;
    }
    return tempPoints;
  }

}
