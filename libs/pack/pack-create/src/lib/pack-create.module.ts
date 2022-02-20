import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { PackCreateComponent } from './pack-create.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { PendingChangesGuard, UtilsModule } from '@hidden-innovation/shared/utils';
import { RouterModule } from '@angular/router';
import { PackDataAccessModule } from '@hidden-innovation/pack/data-access';
import { PackContentCardModule } from '@hidden-innovation/shared/ui/pack-content-card';
import { CommonFormFieldTextareaModule } from '@hidden-innovation/shared/ui/common-form-field-textarea';
import { CommonFormFieldImageModule } from '@hidden-innovation/shared/ui/common-form-field-image';
import { TagsDataAccessModule } from '@hidden-innovation/tags/data-access';
import { FormFieldErrorsModule } from '@hidden-innovation/shared/ui/form-field-errors';
import { CommonFormFieldFileModule } from '@hidden-innovation/shared/ui/common-form-field-file';
import { MediaModule } from '@hidden-innovation/media';
import { ContentSelectorModule } from '@hidden-innovation/shared/ui/content-selector';
import { TestDataAccessModule } from '@hidden-innovation/test/data-access';
import { TestGroupDataAccessModule } from '@hidden-innovation/test-group/data-access';
import { QuestionnaireDataAccessModule } from '@hidden-innovation/questionnaire/data-access';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    CommonFormFieldTextareaModule,
    CommonFormFieldImageModule,
    CommonFormFieldFileModule,
    MediaModule,
    TagsDataAccessModule,
    ContentSelectorModule,
    TestDataAccessModule,
    TestGroupDataAccessModule,
    QuestionnaireDataAccessModule,
    UtilsModule,
    PackDataAccessModule,
    FormFieldErrorsModule,
    PackContentCardModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: PackCreateComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ])
  ],
  declarations: [
    PackCreateComponent
  ],
  providers: [
    UpperCasePipe,
    TitleCasePipe
  ]
})
export class PackCreateModule {
}
