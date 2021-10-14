import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDataFieldComponent } from './common-data-field.component';
import { CommonDataFieldSkeletonModule } from '@hidden-innovation/shared/ui/common-data-field-skeleton';
import { ShimmerModule } from '@hidden-innovation/shared/ui/shimmer';

@NgModule({
  imports: [CommonModule, CommonDataFieldSkeletonModule, ShimmerModule],
  declarations: [
    CommonDataFieldComponent
  ],
  exports: [
    CommonDataFieldComponent
  ]
})
export class CommonDataFieldModule {
}
