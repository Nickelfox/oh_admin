import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackSelectorComponent } from './pack-selector.component';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { RouterModule } from '@angular/router';
import {SortingHeaderNameModule} from "@hidden-innovation/shared/ui/sorting-header-name";
import {SortingHeaderDateModule} from "@hidden-innovation/shared/ui/sorting-header-date";
import {PackDataAccessModule} from "@hidden-innovation/pack/data-access";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UtilsModule,
    CommonFormFieldModule,
    CommonDataFieldStatusModule,
    SortingHeaderNameModule,
    SortingHeaderDateModule,
    PackDataAccessModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: PackSelectorComponent
      }
    ]),
  ],
  declarations: [
    PackSelectorComponent
  ],
})
export class PackSelectorModule {}
