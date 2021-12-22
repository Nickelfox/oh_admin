import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackCreateComponent } from './pack-create.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { RouterModule } from '@angular/router';
import { QuestionnaireDataAccessModule } from '@hidden-innovation/questionnaire/data-access';
import { PackDataAccessModule } from '@hidden-innovation/pack/data-access';
import { TestGroupDataAccessModule } from '@hidden-innovation/test-group/data-access';
import { TestDataAccessModule } from '@hidden-innovation/test/data-access';
import { PackContentCardModule } from '@hidden-innovation/shared/ui/pack-content-card';
import { CommonFormFieldTextareaModule } from '@hidden-innovation/shared/ui/common-form-field-textarea';
import { CommonFormFieldImageModule } from '@hidden-innovation/shared/ui/common-form-field-image';
import { TagsDataAccessModule } from '@hidden-innovation/tags/data-access';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    CommonFormFieldTextareaModule,
    CommonFormFieldImageModule,
    TagsDataAccessModule,
    UtilsModule,
    QuestionnaireDataAccessModule,
    PackDataAccessModule,
    QuestionnaireDataAccessModule,
    TestGroupDataAccessModule,
    TestDataAccessModule,
    PackContentCardModule,
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
  ]
})
export class PackCreateModule {
}
