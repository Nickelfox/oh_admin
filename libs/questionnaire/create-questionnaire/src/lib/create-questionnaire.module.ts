import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionnaireComponent } from './create-questionnaire.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
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
  ],
})
export class CreateQuestionnaireModule {}
