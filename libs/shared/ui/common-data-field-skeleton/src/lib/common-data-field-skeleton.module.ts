import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDataFieldSkeletonComponent } from './common-data-field-skeleton.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CommonDataFieldSkeletonComponent
  ],
  exports: [
    CommonDataFieldSkeletonComponent
  ]
})
export class CommonDataFieldSkeletonModule {}
