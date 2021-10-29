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
    questions: new FormArray<Question>([], [
      Validators.min(2)
    ])
  });

  choiceType = QuestionTypeEnum;

  showField = false;
  showIcon = false;
  showSentiment = true;
  selected = true;

  constructor(
    private fb: FormBuilder
  ) {

  }

  get questionsFormArray(): FormArray<Question> {
    return this.questionnaire.controls.questions as FormArray<Question>;
  }

  triggerQuestionType(type: QuestionTypeEnum): void {
    const formGroup: FormGroup<Question> | null = this.buildQuestion(type);
    if (!formGroup) {
      throw Error();
    }
    this.questionsFormArray.push(formGroup);
    console.log(this.questionnaire.controls.name.value);
  }

  private buildQuestion(type: QuestionTypeEnum): FormGroup<Question> | null {
    switch (type) {
      case QuestionTypeEnum.MULITPLE_CHOICE:
        return this.fb.group({
          name: new FormControl<string>('', [
            Validators.required
          ]),
          type: new FormControl<QuestionTypeEnum>(type, [
            Validators.required
          ]),
          description: new FormControl<string>(''),
          reason: new FormControl<string>(''),
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
