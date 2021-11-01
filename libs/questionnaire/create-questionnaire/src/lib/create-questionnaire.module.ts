import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionnaireComponent } from './create-questionnaire.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { QuestionnaireQuestionsModule } from '@hidden-innovation/shared/ui/questionnaire-questions';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    QuestionnaireQuestionsModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CreateQuestionnaireComponent
      }
    ]),
    A11yModule,
  ],
  declarations: [
    CreateQuestionnaireComponent
  ],
})
export class CreateQuestionnaireModule {}
