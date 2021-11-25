import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireService } from './services/questionnaire.service';
import { QuestionnaireStore } from './store/questionnaire.store';
import { QuestionnaireUtilitiesService } from './services/questionnaire-utilities.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    QuestionnaireUtilitiesService,
    QuestionnaireService,
    QuestionnaireStore
  ]
})
export class QuestionnaireDataAccessModule {}
