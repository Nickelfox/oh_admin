import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  AnswerCore,
  ImageSelectAnswer,
  MinMaxPoints,
  MultipleChoiceAnswer,
  Question,
  Questionnaire
} from '@hidden-innovation/questionnaire/data-access';
import { Validators } from '@angular/forms';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { flattenDepth, max, min } from 'lodash-es';
import { QuestionnaireStore } from '../../../data-access/src/lib/store/questionnaire.store';

@Component({
  selector: 'hidden-innovation-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuestionnaireComponent {

  questionnaire: FormGroup<Questionnaire> = new FormGroup<Questionnaire>({
    name: new FormControl<string>('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    isScoring: new FormControl<boolean>(false),
    questions: new FormArray<Question>([], [
      Validators.min(2)
    ])
  });

  choiceType = QuestionTypeEnum;
  choiceTypeIte = Object.values(QuestionTypeEnum);

  activeQuestion: number | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    public formValidationService: FormValidationService,
    public store: QuestionnaireStore
  ) {
  }

  get questionsFormArray(): FormArray<Question> {
    return this.questionnaire.controls.questions as FormArray<Question>;
  }

  minMaxPoints(): MinMaxPoints | undefined {
    let tempPoints: MinMaxPoints = {
      max: 0,
      min: 0
    };
    if (this.questionsFormArray.length) {
      const answers: (MultipleChoiceAnswer[] | AnswerCore[])[] = this.questionsFormArray.value.filter(value => !value.omitScoring)?.map(v => v.answer);
      const imageAnswer: (ImageSelectAnswer[])[] = this.questionsFormArray.value.map(v => v.imageAnswer);
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

  buildQuestion(type: QuestionTypeEnum): FormGroup<Question> {
    return new FormGroup<Question>({
      name: new FormControl<string>('', [
        RxwebValidators.required(),
        RxwebValidators.notEmpty()
      ]),
      questionType: new FormControl<QuestionTypeEnum>(type, [
        Validators.required
      ]),
      description: new FormControl<string>(''),
      whyAreWeAsking: new FormControl<boolean>(false),
      whyAreWeAskingQuestion: new FormControl<string>(''),
      showIcon: new FormControl<boolean>(false),
      omitScoring: new FormControl<boolean>(false),
      answer: new FormArray<MultipleChoiceAnswer | AnswerCore>([]),
      imageAnswer: new FormArray<ImageSelectAnswer>([])
    });
  }

  submit(): void {
    this.questionnaire.markAllAsDirty();
    this.questionnaire.markAllAsTouched();
    if (this.questionnaire.invalid) {
      return;
    }
    const alteredQuestionnaire: Questionnaire = {
      name: this.questionnaire.value.name,
      isScoring: this.questionnaire.value.isScoring,
      questions: this.questionnaire.value.questions?.map(question => {
        return {
          ...question,
          questionType: question.questionType === QuestionTypeEnum.NUMBER_SELECT ? ('VERTICLE_SELECT' as QuestionTypeEnum) : question.questionType
        };
      })
    };
    this.store.createQuestionnaire$(alteredQuestionnaire);
  }

  questionFormGroup(questionIndex: number): FormGroup<Question> {
    return this.questionsFormArray.controls[questionIndex] as FormGroup<Question>;
  }

  addQuestion(formGroup: FormGroup<Question>): void {
    this.questionsFormArray.push(formGroup);
    this.activeQuestion = this.questionsFormArray.controls.length - 1;
  }

  addAnswer(question: { index: string; type: QuestionTypeEnum }): void {
    let answerFormArray: FormArray;
    let answer: FormGroup<MultipleChoiceAnswer | ImageSelectAnswer | AnswerCore>;

    switch (question.type) {
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.answer as FormArray<MultipleChoiceAnswer>;
        answer = new FormGroup<MultipleChoiceAnswer>({
          name: new FormControl<string>('', [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ]),
          point: new FormControl<number>(undefined, this.formValidationService.pointValidations),
          iconName: new FormControl<string>('')
        });
        break;
      case QuestionTypeEnum.IMAGE_SELECT:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.imageAnswer as FormArray<ImageSelectAnswer>;
        answer = new FormGroup<ImageSelectAnswer>({
          point: new FormControl<number>(undefined, this.formValidationService.pointValidations),
          title: new FormControl<string>('', [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ]),
          subTitle: new FormControl<string>('', [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ]),
          imageId: new FormControl<number>(undefined, [
            RxwebValidators.required(),
            RxwebValidators.numeric({
              allowDecimal: false,
              acceptValue: NumericValueType.PositiveNumber
            })
          ]),
          image: new FormControl<string>({ value: '', disabled: true }),
          imageName: new FormControl<string>({ value: '', disabled: true })
        });
        break;
      default:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.answer as FormArray<AnswerCore>;
        answer = new FormGroup<AnswerCore>({
          name: new FormControl<string>('', [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ]),
          point: new FormControl<number>(undefined, this.formValidationService.pointValidations)
        });
    }
    answerFormArray.push(answer);
    this.minMaxPoints();
  }

  triggerQuestionType(type: QuestionTypeEnum): void {
    const fg: FormGroup<Question> = this.buildQuestion(type);
    this.addQuestion(fg);
  }

  removeQuestion(index: number): void {
    this.questionsFormArray.removeAt(index);
    this.activeQuestion = undefined;
  }

}
