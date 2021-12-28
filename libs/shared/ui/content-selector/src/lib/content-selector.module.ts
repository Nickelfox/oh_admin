import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentSelectorComponent } from './content-selector.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule,
    CommonDataFieldStatusModule
  ],
  declarations: [
    ContentSelectorComponent
  ]
})

export class ContentSelectorModule {
}
