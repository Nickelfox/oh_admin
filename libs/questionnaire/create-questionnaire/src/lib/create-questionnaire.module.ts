import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionnaireComponent } from './create-questionnaire.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { QuestionnaireQuestionFormModule } from '@hidden-innovation/shared/ui/questionnaire-question-form';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    QuestionnaireQuestionFormModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CreateQuestionnaireComponent
      }
    ]),
    A11yModule
  ],
  declarations: [
    CreateQuestionnaireComponent
  ]
})
export class CreateQuestionnaireModule {
}
