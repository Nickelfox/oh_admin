import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
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
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { flattenDepth, max, min } from 'lodash-es';

@Component({
  selector: 'hidden-innovation-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuestionnaireComponent {

  questionnaire: FormGroup<Questionnaire> = new FormGroup<Questionnaire>({
    name: new FormControl<string>('', this.formValidationService.nameValidations),
    isScoring: new FormControl<boolean>(false),
    questions: new FormArray<Question>([], [
      Validators.min(2)
    ])
  });

  choiceType = QuestionTypeEnum;
  choiceTypeIte = Object.values(QuestionTypeEnum);

  activeQuestion: number | undefined;

  constructor(
    public formValidationService: FormValidationService
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
      const answers: (MultipleChoiceAnswer[] | AnswerCore[])[] = this.questionsFormArray.value.map(v => v.answer);
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
      name: new FormControl<string>('', this.formValidationService.nameValidations),
      questionType: new FormControl<QuestionTypeEnum>(type, [
        Validators.required
      ]),
      description: new FormControl<string>(''),
      whyAreWeAsking: new FormControl<boolean>(false),
      whyAreWeAskingQuestion: new FormControl<string>(''),
      showIcon: new FormControl<boolean>(false),
      answer: new FormArray<MultipleChoiceAnswer | AnswerCore>([]),
      imageAnswer: new FormArray<ImageSelectAnswer>([])
    });
  }

  submit(): void {
    console.log(this.questionnaire);
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
      case QuestionTypeEnum.MULITPLE_CHOICE:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.answer as FormArray<MultipleChoiceAnswer>;
        answer = new FormGroup<MultipleChoiceAnswer>({
          name: new FormControl<string>('', this.formValidationService.nameValidations),
          point: new FormControl<number>(undefined, this.formValidationService.pointValidations),
          iconName: new FormControl<string>('', [
            RxwebValidators.notEmpty()
          ])
        });
        break;
      case QuestionTypeEnum.IMAGE_SELECT:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.answer as unknown as FormArray<ImageSelectAnswer>;
        answer = new FormGroup<ImageSelectAnswer>({
          point: new FormControl<number>(),
          title: new FormControl<string>(),
          subTitle: new FormControl<string>(),
          imageId: new FormControl<number>()
        });
        break;
      default:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.answer as FormArray<AnswerCore>;
        answer = new FormGroup<AnswerCore>({
          name: new FormControl<string>('', this.formValidationService.nameValidations),
          point: new FormControl<number>()
        });
    }
    answerFormArray.push(answer);
    this.minMaxPoints();
  }

  triggerQuestionType(type: QuestionTypeEnum): void {
    const fg: FormGroup<Question> = this.buildQuestion(type);
    this.addQuestion(fg);
  }

}
