import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionnaireComponent } from './create-questionnaire.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CreateQuestionnaireComponent,
      },
    ]),
  ],
  declarations: [
    CreateQuestionnaireComponent
  ],
})
export class CreateQuestionnaireModule {}
