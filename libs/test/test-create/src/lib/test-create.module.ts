import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { TestCreateComponent } from './test-create.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { PendingChangesGuard, UtilsModule } from '@hidden-innovation/shared/utils';
import { TagsDataAccessModule } from '@hidden-innovation/tags/data-access';
import { MediaModule } from '@hidden-innovation/media';
import { CommonFormFieldImageModule } from '@hidden-innovation/shared/ui/common-form-field-image';
import { CommonFormFieldTextareaModule } from '@hidden-innovation/shared/ui/common-form-field-textarea';
import { CommonFormFieldVideoModule } from '@hidden-innovation/shared/ui/common-form-field-video';
import { CommonFormFieldTagAutocompleteModule } from '@hidden-innovation/shared/ui/common-form-field-tag-autocomplete';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { TestDataAccessModule } from '@hidden-innovation/test/data-access';
import { MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';
import { FormFieldErrorsModule } from '@hidden-innovation/shared/ui/form-field-errors';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    CommonFormFieldImageModule,
    UtilsModule,
    TagsDataAccessModule,
    CommonFormFieldTextareaModule,
    CommonFormFieldVideoModule,
    FormFieldErrorsModule,
    CommonFormFieldTagAutocompleteModule,
    MediaModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: TestCreateComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]),
    RxReactiveFormsModule,
    TestDataAccessModule
  ],
  declarations: [
    TestCreateComponent
  ],
  providers: [
    TitleCasePipe
  ]
})
export class TestCreateModule {
}
