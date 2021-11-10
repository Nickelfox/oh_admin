import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireService } from './services/questionnaire.service';
import { QuestionnaireStore } from './store/questionnaire.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    QuestionnaireService,
    QuestionnaireStore
  ]
})
export class QuestionnaireDataAccessModule {}
