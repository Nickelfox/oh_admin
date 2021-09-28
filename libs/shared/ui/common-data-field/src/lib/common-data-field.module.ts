import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDataFieldComponent } from './common-data-field.component';
import { CommonDataFieldSkeletonModule } from '@hidden-innovation/shared/ui/common-data-field-skeleton';
import { ContentLoaderModule } from '@ngneat/content-loader';

@NgModule({
  imports: [CommonModule, CommonDataFieldSkeletonModule, ContentLoaderModule],
  declarations: [
    CommonDataFieldComponent
  ],
  exports: [
    CommonDataFieldComponent
  ]
})
export class CommonDataFieldModule {}
