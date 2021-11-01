import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireQuestionsComponent } from './questionnaire-questions.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
  ],
  declarations: [
    QuestionnaireQuestionsComponent
  ],
  exports: [
    QuestionnaireQuestionsComponent
  ]
})
export class QuestionnaireQuestionsModule {}
