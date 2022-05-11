import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireListingComponent } from './questionnaire-listing.component';
import { MaterialModule } from '@hidden-innovation/material';
import { QuestionnaireDataAccessModule } from '@hidden-innovation/questionnaire/data-access';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { RouterModule } from '@angular/router';
import { SortingHeaderDateModule } from '@hidden-innovation/shared/ui/sorting-header-date';
import { SortingHeaderNameModule } from '@hidden-innovation/shared/ui/sorting-header-name';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: QuestionnaireListingComponent
      }
    ]),
    MaterialModule,
    QuestionnaireDataAccessModule,
    CommonDataFieldStatusModule,
    SortingHeaderDateModule,
    SortingHeaderNameModule,
    UtilsModule
  ],
  declarations: [
    QuestionnaireListingComponent
  ]
})

export class QuestionnaireListingModule {
}
