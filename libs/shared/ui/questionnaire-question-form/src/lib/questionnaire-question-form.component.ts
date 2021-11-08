import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { QuestionTypeEnum } from '@hidden-innovation/shared/models';
import {
  AnswerCore,
  ImageSelectAnswer,
  MinMaxPoints,
  MultipleChoiceAnswer,
  Question
} from '@hidden-innovation/questionnaire/data-access';
import { FormGroupDirective } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormValidationService } from '@hidden-innovation/shared/form-config';
import { max, min } from 'lodash-es';

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

  showField = false;
  showIcon = false;
  showSentiment = true;

  question?: FormGroup<Question>;

  constructor(
    private fb: FormBuilder,
    private questionGroup: FormGroupDirective,
    public formValidationService: FormValidationService
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

  multipleChoiceAnswerGroup(index: number): FormGroup<MultipleChoiceAnswer | AnswerCore> {
    return this.answersArray.controls[index] as FormGroup<MultipleChoiceAnswer | AnswerCore>;
  }

  ngOnInit() {
    this.question = this.questionsFormArray.get(this._groupName) as FormGroup;
  }

  addNewAnswer(): void {
    this.addAnswer.emit({
      index: this._groupName,
      type: this.type
    });
  }
}
