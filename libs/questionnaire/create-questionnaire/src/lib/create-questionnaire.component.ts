import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { GenericDialogPrompt, OperationTypeEnum, QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  AnswerCore,
  ImageSelectAnswer,
  MultipleChoiceAnswer,
  Question,
  QuestionExtended,
  Questionnaire,
  QuestionnaireExtended,
  QuestionnaireStore,
  QuestionnaireUtilitiesService
} from '@hidden-innovation/questionnaire/data-access';
import { Validators } from '@angular/forms';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ConstantDataService, FormValidationService } from '@hidden-innovation/shared/form-config';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentCanDeactivate } from '@hidden-innovation/shared/utils';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { MatDialog } from '@angular/material/dialog';

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
      ...this.formValidationService.requiredFieldValidation
    ]),
    whatYouWillGetOutOfIt: new FormControl<string>(''),
    overview: new FormControl<string>(''),
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
    public constantDataService: ConstantDataService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public questionnaireUtilitiesService: QuestionnaireUtilitiesService
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
    const { name, isScoring, questions, whatYouWillGetOutOfIt, overview } = obj;
    this.questionnaire.patchValue({
      name,
      isScoring,
      whatYouWillGetOutOfIt,
      overview
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
      const fg: FormGroup<Question> = this.questionnaireUtilitiesService.buildQuestion(q.questionType, q);
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
              type: q.questionType,
              showIcon: q.showIcon
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

  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const from = this.clamp(fromIndex, formArray.length - 1);
    const to = this.clamp(toIndex, formArray.length - 1);
    if (from === to) {
      return;
    }
    const previous = formArray.at(from);
    const current = formArray.at(to);
    formArray.setControl(to, previous);
    formArray.setControl(from, current);
  }

  /** Clamps a number between zero and a maximum. */
  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
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
      ...this.questionnaire.value,
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
    question: { index: string; type: QuestionTypeEnum, showIcon?: boolean },
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
            RxwebValidators.notEmpty(),
            RxwebValidators.unique(),
            RxwebValidators.maxLength({
              value: this.formValidationService.FIELD_VALIDATION_VALUES.ANSWER_LENGTH
            })
          ]),
          point: new FormControl<number>(multipleChoice?.point ?? undefined, this.formValidationService.pointValidations),
          iconName: new FormControl<string>({
            value: multipleChoice?.iconName ?? '',
            disabled: !question.showIcon
          }, [
            RxwebValidators.required(),
            RxwebValidators.notEmpty()
          ])
        });
        break;
      case QuestionTypeEnum.IMAGE_SELECT:
        answerFormArray = this.questionFormGroup(parseInt(question.index)).controls.imageAnswer as FormArray<ImageSelectAnswer>;
        answer = new FormGroup<ImageSelectAnswer>({
          point: new FormControl<number>(imageAnswerData?.point ?? undefined, this.formValidationService.pointValidations),
          title: new FormControl<string>(imageAnswerData?.title ?? undefined, [
            RxwebValidators.required(),
            RxwebValidators.notEmpty(),
            RxwebValidators.unique()
          ]),
          subTitle: new FormControl<string>(imageAnswerData?.subTitle ?? undefined, [
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
            RxwebValidators.notEmpty(),
            RxwebValidators.unique()
          ]),
          point: new FormControl<number>(answerData?.point ?? undefined, this.formValidationService.pointValidations)
        });
    }
    answerFormArray.push(answer);
    this.questionnaireUtilitiesService.minMaxPoints(this.questionsFormArray);
    this.cdr.markForCheck();
  }

  triggerQuestionType(type: QuestionTypeEnum): void {
    const fg: FormGroup<Question> = this.questionnaireUtilitiesService.buildQuestion(type);
    this.addQuestion(fg);
  }

  removeAnswer(index: number, activeQuestion: number): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Answer?',
      desc: `Are you sure you want to delete this Answer?`,
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
        const question: FormGroup<Question> = this.questionFormGroup(activeQuestion);
        if (question.value.questionType === QuestionTypeEnum.IMAGE_SELECT) {
          const imageArray: FormArray<ImageSelectAnswer> = question.controls.imageAnswer as FormArray<ImageSelectAnswer>;
          imageArray.removeAt(index);
          return;
        }
        const answerArray: FormArray<AnswerCore> = question.controls.answer as FormArray<AnswerCore>;
        answerArray.removeAt(index);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        this.cdr.checkNoChanges();
      }
    });
  }

  removeQuestion(index: number): void {
    const dialogData: GenericDialogPrompt = {
      title: 'Delete Question?',
      desc: `Are you sure you want to delete this Question?`,
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
        this.questionsFormArray.removeAt(index);
        this.activeQuestion = undefined;
        this.cdr.markForCheck();
      }
    });
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
