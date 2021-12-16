import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestGroupService } from './services/test-group.service';
import { TestGroupStore } from './store/test-group.store';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TestGroupService,
    TestGroupStore
  ]
})
export class TestGroupDataAccessModule {}
