import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTabGroupComponent } from './test-tab-group.component';
import { MaterialModule } from '@hidden-innovation/material';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  declarations: [
    TestTabGroupComponent
  ],
  exports: [
    TestTabGroupComponent
  ]
})
export class TestTabGroupModule {}
