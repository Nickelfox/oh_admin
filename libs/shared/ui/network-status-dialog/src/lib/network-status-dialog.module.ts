import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkStatusDialogComponent } from './network-status-dialog.component';
import { MaterialModule } from '@hidden-innovation/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    NetworkStatusDialogComponent
  ],
})
export class NetworkStatusDialogModule {}
