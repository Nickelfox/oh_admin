import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  AnswerCore,
  ImageSelectAnswer,
  MultipleChoiceAnswer,
  Question,
  Questionnaire
} from '@hidden-innovation/questionnaire/data-access';
import { Validators } from '@angular/forms';

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
      Validators.required
    ]),
    isScoring: new FormControl<boolean>(false),
    questions: new FormArray<Question>([], [
      Validators.min(2)
    ])
  });

  choiceType = QuestionTypeEnum;
  choiceTypeIte = Object.values(QuestionTypeEnum);

  showSentiment = true;

  constructor(
    private fb: FormBuilder
  ) {
  }

  get questionsFormArray(): FormArray<Question> {
    return this.questionnaire.controls.questions as FormArray<Question>;
  }

  questionFormGroup(questionIndex: number): FormGroup<Question> {
    return this.questionsFormArray.controls[questionIndex] as FormGroup<Question>;
  }

  addQuestion(formGroup: FormGroup<Question>): void {
    this.questionsFormArray.push(formGroup);
  }

  triggerQuestionType(type: any): void {
    console.log(type);
    const formGroup: FormGroup<Question> | null = this.buildQuestion(type);
    if (!formGroup) {
      throw Error();
    }
    this.questionsFormArray.push(formGroup);
    console.log(this.questionnaire.controls.questions.value);
  }

  getCoreQuestionFGroup(type: QuestionTypeEnum): { whyAreWeAskingQuestion: FormControl<string>; name: FormControl<string>; description: FormControl<string>; questionType: FormControl<QuestionTypeEnum>; whyAreWeAsking: FormControl<boolean> } {
    return {
      name: new FormControl<string>('dsjak', [
        Validators.required
      ]),
      questionType: new FormControl<QuestionTypeEnum>(type, [
        Validators.required
      ]),
      description: new FormControl<string>('dsjak'),
      whyAreWeAsking: new FormControl<boolean>(false),
      whyAreWeAskingQuestion: new FormControl<string>('')
    };
  }

  private buildQuestion(type: QuestionTypeEnum): FormGroup<Question> | null {
    switch (type) {
      case QuestionTypeEnum.MULITPLE_CHOICE:
        return this.fb.group({
          ...this.getCoreQuestionFGroup(type),
          answers: new FormArray<MultipleChoiceAnswer>([])
        });
      case QuestionTypeEnum.SLIDER:
        return this.fb.group({
          ...this.getCoreQuestionFGroup(type),
          answers: new FormArray<AnswerCore>([])
        });
      case QuestionTypeEnum.IMAGE_SELECT:
        return this.fb.group({
          ...this.getCoreQuestionFGroup(type),
          imageAnswer: new FormArray<ImageSelectAnswer>([])
        });
      case QuestionTypeEnum.YES_NO:
        return this.fb.group({
          ...this.getCoreQuestionFGroup(type),
          answers: new FormArray<AnswerCore>([])
        });
      case QuestionTypeEnum.VERTICLE_SELECT:
        return this.fb.group({
          ...this.getCoreQuestionFGroup(type),
          answers: new FormArray<AnswerCore>([])
        });
      default:
        return null;
    }
  }



}
