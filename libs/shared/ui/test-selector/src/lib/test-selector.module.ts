import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestSelectorComponent } from './test-selector.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { SortingHeaderNameModule } from '@hidden-innovation/shared/ui/sorting-header-name';
import { SortingHeaderDateModule } from '@hidden-innovation/shared/ui/sorting-header-date';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule,
    SortingHeaderNameModule,
    SortingHeaderDateModule,
    CommonFormFieldModule,
    CommonDataFieldStatusModule
  ],
  declarations: [
    TestSelectorComponent
  ]
})
export class TestSelectorModule {
}
