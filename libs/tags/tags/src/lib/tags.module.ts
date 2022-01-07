import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonDataFieldStatusModule } from '@hidden-innovation/shared/ui/common-data-field-status';
import { TagsDataAccessModule } from '@hidden-innovation/tags/data-access';
import { SortingHeaderDateModule } from '@hidden-innovation/shared/ui/sorting-header-date';
import { SortingHeaderNameModule } from '@hidden-innovation/shared/ui/sorting-header-name';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: TagsComponent
      },
    ]),
    MaterialModule,
    TagsDataAccessModule,
    UtilsModule,
    CommonDataFieldStatusModule,
    SortingHeaderDateModule,
    SortingHeaderNameModule,
  ],
  declarations: [
    TagsComponent
  ]
})
export class TagsModule {
}
