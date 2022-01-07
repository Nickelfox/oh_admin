import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionnaireComponent } from './create-questionnaire.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { QuestionnaireQuestionFormModule } from '@hidden-innovation/shared/ui/questionnaire-question-form';
import { QuestionnaireDataAccessModule } from '@hidden-innovation/questionnaire/data-access';
import { PendingChangesGuard, UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule,
    MaterialModule,
    CommonFormFieldModule,
    QuestionnaireQuestionFormModule,
    QuestionnaireDataAccessModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CreateQuestionnaireComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]),
    A11yModule,
  ],
  declarations: [
    CreateQuestionnaireComponent
  ]
})
export class CreateQuestionnaireModule {
}
