import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { GenericDialogPrompt, QuestionTypeEnum } from '@hidden-innovation/shared/models';
import {
  AnswerCore,
  ImageSelectAnswer,
  MinMaxPoints,
  MultipleChoiceAnswer,
  Question
} from '@hidden-innovation/questionnaire/data-access';
import { FormGroupDirective, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { max, min } from 'lodash-es';
import { tap } from 'rxjs/operators';
import { ImageCropperResponseData } from '@hidden-innovation/media';
import { PromptDialogComponent } from '@hidden-innovation/shared/ui/prompt-dialog';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'hidden-innovation-questionnaire-question-form',
  templateUrl: './questionnaire-question-form.component.html',
  styleUrls: ['./questionnaire-question-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireQuestionFormComponent implements OnInit {

  @Input() type!: QuestionTypeEnum;
  @Input() _groupName!: string;
  @Input() isScoring!: boolean;
  @Input() minMaxPoints!: MinMaxPoints;

  @Output() addAnswer: EventEmitter<{
    index: string,
    type: QuestionTypeEnum
  }> = new EventEmitter<{
    index: string,
    type: QuestionTypeEnum
  }>();

  choiceType = QuestionTypeEnum;
  choiceTypeIte = Object.values(QuestionTypeEnum);

  question?: FormGroup<Question>;

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private questionGroup: FormGroupDirective,
    public formValidationService: FormValidationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  get questionMinMaxPoints(): MinMaxPoints | undefined {
    const answers: (MultipleChoiceAnswer[] | AnswerCore[]) = this.question?.controls.answer.value ?? [];
    const imageAnswer: ImageSelectAnswer[] = this.question?.controls.imageAnswer.value ?? [];
    const nestedPoints = answers.map(value => value.point);
    const nestedImagePoints = imageAnswer.map(value => value.point);
    const points: number[] = [...nestedPoints, ...nestedImagePoints].map(value => typeof value === 'string' ? parseInt(value) : value);
    const maxPoint = max(points) !== null && max(points) !== undefined ? max(points) : 0;
    const minPoint = min(points) !== null && min(points) !== undefined ? min(points) : 0;
    return {
      max: maxPoint,
      min: minPoint
    };
  }

  get questionNumber(): number | string {
    return this._groupName ? parseInt(this._groupName) + 1 : '--';
  }

  get questionsFormArray(): FormArray<Question> {
    return this.questionGroup.control.get('questions') as FormArray<Question>;
  }

  get answersArray(): FormArray<MultipleChoiceAnswer> {
    return this.question?.controls.answer as FormArray<MultipleChoiceAnswer>;
  }

  get imageAnswersArray(): FormArray<ImageSelectAnswer> {
    return this.question?.controls.imageAnswer as FormArray<ImageSelectAnswer>;
  }

  multipleChoiceAnswerGroup(index: number): FormGroup<MultipleChoiceAnswer | AnswerCore> {
    return this.answersArray.controls[index] as FormGroup<MultipleChoiceAnswer | AnswerCore>;
  }

  imageAnswerGroup(index: number): FormGroup<ImageSelectAnswer> {
    return this.imageAnswersArray.controls[index] as FormGroup<ImageSelectAnswer>;
  }

  ngOnInit() {
    this.question = this.questionsFormArray.get(this._groupName) as FormGroup;
    this.question.controls.questionType.valueChanges.pipe(
      tap(type => {
        if (type === QuestionTypeEnum.IMAGE_SELECT) {
          this.question?.controls.answer.removeValidators([]);
          this.question?.controls.imageAnswer.addValidators([
            Validators.required,
            Validators.minLength(2)
          ]);
        } else {
          this.question?.controls.imageAnswer.removeValidators([]);
          this.question?.controls.answer.addValidators([
            Validators.required,
            Validators.minLength(2)
          ]);
        }
        this.answersArray.clear();
        this.imageAnswersArray.clear();
        this.question?.updateValueAndValidity();
      })
    ).subscribe();
    this.question.controls.whyAreWeAsking.valueChanges.pipe(
      tap(isActive => {
        isActive ? this.question?.controls.whyAreWeAskingQuestion.enable() : this.question?.controls.whyAreWeAskingQuestion.disable();
      })
    ).subscribe();
    this.question.controls.showIcon.valueChanges.pipe(
      tap(isActive => {
        if (isActive) {
          this.answersArray.controls.map(ctr => ctr.get('iconName')?.enable());
        } else {
          this.answersArray.controls.map(ctr => ctr.get('iconName')?.disable());
        }
        this.answersArray.updateValueAndValidity();
      })
    ).subscribe();
  }

  mapImageToForm($event: ImageCropperResponseData, answerIndex: number) {
    this.imageAnswerGroup(answerIndex).patchValue({
      imageId: $event.attachmentId,
      imageBlob: $event.croppedImage,
      imageName: $event.fileName
    });
    this.cdr.markForCheck();
  }

  removeImage(answerIndex: number): void {
    this.imageAnswerGroup(answerIndex).patchValue({
      imageName: '',
      imageBlob: '',
      imageId: undefined
    });
  }

  addNewAnswer(): void {
    this.addAnswer.emit({
      index: this._groupName,
      type: this.type
    });
  }

  removeAnswer(index: number): void {
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
        if (this.question?.value.questionType === QuestionTypeEnum.IMAGE_SELECT) {
          const imageArray: FormArray<ImageSelectAnswer> = this.question?.controls.imageAnswer as FormArray<ImageSelectAnswer>;
          imageArray.removeAt(index);
          this.cdr.markForCheck();
          return;
        }
        const answerArray: FormArray<AnswerCore> = this.question?.controls.answer as FormArray<AnswerCore>;
        answerArray.removeAt(index);
        this.cdr.markForCheck();
      }
    });
  }

}
