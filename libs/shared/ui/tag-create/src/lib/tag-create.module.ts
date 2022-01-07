import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCreateComponent } from './tag-create.component';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [
    CommonModule,
    CommonFormFieldModule,
    MaterialModule,
    UtilsModule,
  ],
  declarations: [
    TagCreateComponent
  ]
})
export class TagCreateModule {
}
