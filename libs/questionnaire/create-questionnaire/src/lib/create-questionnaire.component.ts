import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, ViewEncapsulation } from '@angular/core';
import { OperationTypeEnum, QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  AnswerCore,
  ImageSelectAnswer,
  MinMaxPoints,
  MultipleChoiceAnswer,
  Question,
  QuestionExtended,
  Questionnaire,
  QuestionnaireExtended,
  QuestionnaireStore
} from '@hidden-innovation/questionnaire/data-access';
import { Validators } from '@angular/forms';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { flattenDepth, max, min } from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentCanDeactivate } from '@hidden-innovation/shared/utils';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuestionnaireComponent implements OnDestroy, ComponentCanDeactivate {

  questionnaire: FormGroup<Questionnaire> = new FormGroup<Questionnaire>({
    name: new FormControl<string>('', [
      RxwebValidators.required(),
      RxwebValidators.notEmpty()
    ]),
    isScoring: new FormControl<boolean>(false),
    questions: new FormArray<Question>([], [
      Validators.required,
      Validators.minLength(2)
    ])
  });

  choiceType = QuestionTypeEnum;
  choiceTypeIte = Object.values(QuestionTypeEnum);

  activeQuestion: number | undefined;

  opType?: OperationTypeEnum;

  operationTypeEnum = OperationTypeEnum;
  loaded = false;
  private questionnaireID?: number;

  constructor(
    private hotToastService: HotToastService,
    public formValidationService: FormValidationService,
    public store: QuestionnaireStore,
    private route: ActivatedRoute
  ) {
    this.route.data.pipe(
      filter(data => data?.type !== undefined),
      tap((data) => {
        this.opType = data.type as OperationTypeEnum;
      }),
      switchMap(_ => this.route.params)
    ).subscribe((res) => {
      if (this.opType === OperationTypeEnum.EDIT) {
        this.questionnaireID = res['id'];
        if (!this.questionnaireID) {
          this.hotToastService.error('Error occurred while fetching details');
          return;
        }
        this.store.selectedQuestionnaire$.subscribe((ques) => {
          if (ques) {
            this.populateQuestionnaire(ques);
          }
        });
        this.store.getQuestionnaireDetails$({
          id: this.questionnaireID
        });
      }
    });
    this.store.loaded$.pipe(
      tap(res => this.loaded = res)
    ).subscribe();
  }

  get questionsFormArray(): FormArray<Question> {
    return this.questionnaire.controls.questions as FormArray<Question>;
  }

  changedQuestionType(questions: Question[]): Question[] {
    return questions?.map(question => {
      return {
        ...question,
        questionType: question.questionType === QuestionTypeEnum.NUMBER_SELECT ? ('VERTICLE_SELECT' as QuestionTypeEnum) : question.questionType
      };
    });
  }

  parseQuestionType(questions: QuestionExtended[]): QuestionExtended[] {
    return questions ? questions.map(question => {
      return {
        ...question,
        questionType: (question.questionType === 'VERTICLE_SELECT' as QuestionTypeEnum) ? QuestionTypeEnum.NUMBER_SELECT : question.questionType
      };
    }) : [];
  }

  populateQuestionnaire(obj: QuestionnaireExtended): void {
    const { name, isScoring, questions } = obj;
    this.questionnaire.patchValue({
      name,
      isScoring
    });
    const tempQuestions: Question[] = this.parseQuestionType(questions).map(q => {
      if (q.questionType !== QuestionTypeEnum.IMAGE_SELECT) {
        return q;
      } else {
        return {
          ...q,
          imageAnswer: q.imageAnswer.map(ians => {
            return {
              ...ians,
              imageName: ians.image.fileName,
              imageBlob: ians.image.url
            };
          })
        };
      }
    });
    tempQuestions.map((q, questionIndex) => {
      const fg: FormGroup<Question> = this.buildQuestion(q.questionType, q);
      this.addQuestion(fg);
      if (q.questionType === QuestionTypeEnum.IMAGE_SELECT) {
        q.imageAnswer.map(imAns => {
          this.addAnswer({
            index: questionIndex.toString(),
            type: q.questionType
          }, undefined, undefined, imAns);
        });
      } else {
        q.answer.map(ans => {
          if (q.questionType === QuestionTypeEnum.MULTIPLE_CHOICE) {
            this.addAnswer({
              index: questionIndex.toString(),
              type: q.questionType
            }, undefined, ans as MultipleChoiceAnswer, undefined);
          } else {
            this.addAnswer({
              index: questionIndex.toString(),
              type: q.questionType
            }, ans as AnswerCore, undefined, undefined);
          }
        });
      }
    });
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

  buildQuestion(type: QuestionTypeEnum, questionData?: Question): FormGroup<Question> {
    return new FormGroup<Question>({
      name: new FormControl<string>(questionData?.name ?? '', [
        RxwebValidators.required(),
        RxwebValidators.notEmpty()
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
      answer: new FormArray<MultipleChoiceAnswer | AnswerCore>([], type !== QuestionTypeEnum.IMAGE_SELECT ? [
        Validators.required,
        Validators.minLength(2)
      ] : null),
      imageAnswer: new FormArray<ImageSelectAnswer>([], type === QuestionTypeEnum.IMAGE_SELECT ? [
        Validators.required,
        Validators.minLength(2)
      ] : null)
    });
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questionsFormArray.controls, event.previousIndex, event.currentIndex);
  }

  submit(): void {
    this.questionnaire.markAllAsDirty();
    this.questionnaire.markAllAsTouched();
    if (this.questionnaire.invalid) {
      if (this.questionnaire.controls.name.invalid || this.questionnaire.controls.isScoring.invalid) {
        return;
      }
      if (this.questionnaire.controls.questions.errors?.required || this.questionnaire.controls.questions.errors?.minlength) {
        this.hotToastService.error(this.formValidationService.questionValidationMessage.minLength);
        return;
      }
      return;
    }
    const alteredQuestionnaire: Questionnaire = {
      name: this.questionnaire.value.name,
      isScoring: this.questionnaire.value.isScoring,
      questions: this.changedQuestionType(this.questionnaire.value.questions)
    };
    if (this.opType === OperationTypeEnum.CREATE) {
      this.store.createQuestionnaire$(alteredQuestionnaire);
    } else if (this.opType === OperationTypeEnum.EDIT) {
      if (!this.questionnaireID) {
        this.hotToastService.error('Error occurred while submitting details');
        return;
      }
      this.store.updateQuestionnaire$({
        id: this.questionnaireID,
        questionnaire: alteredQuestionnaire
      });
    }
  }

  questionFormGroup(questionIndex: number): FormGroup<Question> {
    return this.questionsFormArray.controls[questionIndex] as FormGroup<Question>;
  }

  addQuestion(formGroup: FormGroup<Question>): void {
    this.questionsFormArray.push(formGroup);
    this.activeQuestion = this.questionsFormArray.controls.length - 1;
  }

  addAnswer(
    question: { index: string; type: QuestionTypeEnum },
    answerData?: AnswerCore,
    multipleChoice?: MultipleChoiceAnswer,
    imageAnswerData?: ImageSelectAnswer): void {
    let answerFormArray: FormArray;
    let answer: FormGroup<MultipleChoiceAnswer | ImageSelectAnswer | AnswerCore>;

    switch (question.type) {
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.answer as FormArray<MultipleChoiceAnswer>;
        answer = new FormGroup<MultipleChoiceAnswer>({
          name: new FormControl<string>(multipleChoice?.name ?? '', [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ]),
          point: new FormControl<number>(multipleChoice?.point ?? undefined, this.formValidationService.pointValidations),
          iconName: new FormControl<string>(multipleChoice?.iconName ?? '')
        });
        break;
      case QuestionTypeEnum.IMAGE_SELECT:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.imageAnswer as FormArray<ImageSelectAnswer>;
        answer = new FormGroup<ImageSelectAnswer>({
          point: new FormControl<number>(imageAnswerData?.point ?? undefined, this.formValidationService.pointValidations),
          title: new FormControl<string>(imageAnswerData?.title ?? '', [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ]),
          subTitle: new FormControl<string>(imageAnswerData?.subTitle ?? '', [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ]),
          imageId: new FormControl<number>(imageAnswerData?.imageId ?? undefined, [
            RxwebValidators.required(),
            RxwebValidators.numeric({
              allowDecimal: false,
              acceptValue: NumericValueType.PositiveNumber
            })
          ]),
          imageBlob: new FormControl<string>({ value: imageAnswerData?.imageBlob ?? '', disabled: true }),
          imageName: new FormControl<string>({ value: imageAnswerData?.imageName ?? '', disabled: true })
        });
        break;
      default:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.answer as FormArray<AnswerCore>;
        answer = new FormGroup<AnswerCore>({
          name: new FormControl<string>(answerData?.name ?? '', [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ]),
          point: new FormControl<number>(answerData?.point ?? undefined, this.formValidationService.pointValidations)
        });
    }
    answerFormArray.push(answer);
    this.minMaxPoints();
  }

  triggerQuestionType(type: QuestionTypeEnum): void {
    const fg: FormGroup<Question> = this.buildQuestion(type);
    this.addQuestion(fg);
  }

  removeAnswer(index: number, activeQuestion: number): void {
    const question: FormGroup<Question> = this.questionFormGroup(activeQuestion);
    if (question.value.questionType === QuestionTypeEnum.IMAGE_SELECT) {
      const imageArray: FormArray<ImageSelectAnswer> = question.controls.imageAnswer as FormArray<ImageSelectAnswer>;
      imageArray.removeAt(index);
      return;
    }
    const answerArray: FormArray<AnswerCore> = question.controls.answer as FormArray<AnswerCore>;
    answerArray.removeAt(index);
  }

  removeQuestion(index: number): void {
    this.questionsFormArray.removeAt(index);
    this.activeQuestion = undefined;
  }

  ngOnDestroy() {
    this.store.patchState({
      selectedQuestionnaire: undefined
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return this.questionnaire.dirty ? this.loaded : true;
  }
}
