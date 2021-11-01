import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  ImageSelectAnswer,
  MultipleChoiceAnswer,
  Question,
  Questionnaire,
  SliderAnswer, VerticalSelectAnswer, YesNoChoiceAnswer
} from '@hidden-innovation/questionnaire/data-access';
import { Validators } from '@angular/forms';


@Component({
  selector: 'hidden-innovation-questionnaire-questions',
  templateUrl: './questionnaire-questions.component.html',
  styleUrls: ['./questionnaire-questions.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireQuestionsComponent {
  questionnaire: FormGroup<Questionnaire> = new FormGroup<Questionnaire>({
    name: new FormControl<string>('', [
      Validators.required
    ]),
    questions: new FormArray<Question>([], [
      Validators.min(2)
    ])
  });


  choiceType = QuestionTypeEnum;

  showField = false;
  showIcon = false;
  showSentiment = true;
  selected = true;


  triggerQuestionType(type: QuestionTypeEnum): void {
    const formGroup: FormGroup<Question> | null = this.buildQuestion(type);
    if (!formGroup) {
      throw Error();
    }
    this.questionsFormArray.push(formGroup);
    console.log(this.questionnaire.controls.questions.value);
  }

  constructor(
    private fb: FormBuilder
  ) {

  }

  questionFormGroup(questionIndex:number):FormGroup<Question>{
    return  this.questionsFormArray.controls[questionIndex] as FormGroup<Question>;
  }


  get questionsFormArray(): FormArray<Question> {
    return this.questionnaire.controls.questions as FormArray<Question>;
  }

  private buildQuestion(type: QuestionTypeEnum): FormGroup<Question> | null {
    switch (type) {
      case QuestionTypeEnum.MULITPLE_CHOICE:
        return this.fb.group({
          name: new FormControl<string>('dsjak', [
            Validators.required
          ]),
          type: new FormControl<QuestionTypeEnum>(type, [
            Validators.required
          ]),
          description: new FormControl<string>('dsjak'),
          reason: new FormControl<string>('dsjak'),
          answers: new FormArray<MultipleChoiceAnswer>([])
        });
      case QuestionTypeEnum.SLIDER:
        return  this.fb.group({
          name: new FormControl<string>('', [
            Validators.required
          ]),
          type: new FormControl<QuestionTypeEnum>(type, [
            Validators.required
          ]),
          reason: new FormControl<string>(''),
          answers: new FormArray<SliderAnswer>([])
        });
      case QuestionTypeEnum.IMAGE_SELECT:
        return  this.fb.group({
          name: new FormControl<string>('', [
            Validators.required
          ]),
          description: new FormControl<string>(''),
          type: new FormControl<QuestionTypeEnum>(type, [
            Validators.required
          ]),
          reason: new FormControl<string>(''),
          answers: new FormArray<ImageSelectAnswer>([])
        });
      case QuestionTypeEnum.YES_NO:
        return  this.fb.group({
          name: new FormControl<string>('', [
            Validators.required
          ]),
          description: new FormControl<string>(''),
          type: new FormControl<QuestionTypeEnum>(type, [
            Validators.required
          ]),
          reason: new FormControl<string>(''),
          answers: new FormArray<YesNoChoiceAnswer>([])
        });
      case QuestionTypeEnum.VERTICLE_SELECT:
        return  this.fb.group({
          name: new FormControl<string>('', [
            Validators.required
          ]),
          description: new FormControl<string>(''),
          type: new FormControl<QuestionTypeEnum>(type, [
            Validators.required
          ]),
          reason: new FormControl<string>(''),
          answers: new FormArray<VerticalSelectAnswer>([])
        });

      default:
        return null;
    }
  }

}
