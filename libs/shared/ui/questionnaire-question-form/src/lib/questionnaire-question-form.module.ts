import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireQuestionFormComponent } from './questionnaire-question-form.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { MediaModule } from '@hidden-innovation/media';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonFormFieldNumberModule } from '@hidden-innovation/shared/ui/common-form-field-number';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    CommonFormFieldNumberModule,
    MediaModule,
    UtilsModule
  ],
  declarations: [
    QuestionnaireQuestionFormComponent
  ],
  exports: [
    QuestionnaireQuestionFormComponent
  ]
})
export class QuestionnaireQuestionFormModule {}
