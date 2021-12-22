import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackCreateComponent } from './pack-create.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { RouterModule } from '@angular/router';
import { QuestionnaireDataAccessModule } from '@hidden-innovation/questionnaire/data-access';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    UtilsModule,
    QuestionnaireDataAccessModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: PackCreateComponent
      }
    ])
  ],
  declarations: [
    PackCreateComponent
  ],
})
export class PackCreateModule {}
