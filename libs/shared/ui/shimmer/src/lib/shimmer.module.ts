import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShimmerComponent } from './shimmer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ShimmerComponent
  ],
  exports: [
    ShimmerComponent
  ]
})
export class ShimmerModule {}
