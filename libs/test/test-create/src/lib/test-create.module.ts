import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCreateComponent } from './test-create.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { TagsDataAccessModule } from '@hidden-innovation/tags/data-access';
import { MediaModule } from '@hidden-innovation/media';
import { CommonFormFieldImageModule } from '@hidden-innovation/shared/ui/common-form-field-image';
import { CommonFormFieldTextareaModule } from '@hidden-innovation/shared/ui/common-form-field-textarea';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    CommonFormFieldImageModule,
    UtilsModule,
    TagsDataAccessModule,
    CommonFormFieldTextareaModule,
    MediaModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: TestCreateComponent
      }
    ])
  ],
  declarations: [
    TestCreateComponent
  ]
})
export class TestCreateModule {
}
