import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerTextComponent } from './spinner-text.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UtilsModule } from '@hidden-innovation/shared/utils';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    UtilsModule
  ],
  declarations: [
    SpinnerTextComponent
  ],
  exports: [
    SpinnerTextComponent
  ]
})
export class SpinnerTextModule {
}
