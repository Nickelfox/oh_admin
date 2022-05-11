import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDialogComponent } from './info-dialog.component';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    InfoDialogComponent
  ],
})
export class InfoDialogModule {}
