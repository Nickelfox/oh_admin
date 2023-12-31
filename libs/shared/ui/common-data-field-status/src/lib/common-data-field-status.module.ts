import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDataFieldStatusComponent } from './common-data-field-status.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule],
  declarations: [
    CommonDataFieldStatusComponent
  ],
  exports: [
    CommonDataFieldStatusComponent
  ]
})
export class CommonDataFieldStatusModule {}
