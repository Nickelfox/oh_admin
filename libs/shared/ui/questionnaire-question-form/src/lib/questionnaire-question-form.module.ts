import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireQuestionFormComponent } from './questionnaire-question-form.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
  ],
  declarations: [
    QuestionnaireQuestionFormComponent
  ],
  exports: [
    QuestionnaireQuestionFormComponent
  ]
})
export class QuestionnaireQuestionFormModule {}
