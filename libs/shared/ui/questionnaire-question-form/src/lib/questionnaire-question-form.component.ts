import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { QuestionTypeEnum } from '@hidden-innovation/shared/models';
import { FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'hidden-innovation-questionnaire-question-form',
  templateUrl: './questionnaire-question-form.component.html',
  styleUrls: ['./questionnaire-question-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireQuestionFormComponent {

  @Input() type?: QuestionTypeEnum;

  choiceType = QuestionTypeEnum;

  showField = false;
  showIcon = false;
  showSentiment = true;
  selected = true;

  form = FormGroup;

  constructor(
    private fb: FormBuilder,
    fgd: FormGroupDirective
  ) {
  }

}
