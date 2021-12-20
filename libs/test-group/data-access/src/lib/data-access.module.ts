import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestGroupService } from './services/test-group.service';
import { TestGroupStore } from './store/test-group.store';
import { TestGroupUtilitiesService } from './services/test-group-utilities.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TestGroupUtilitiesService,
    TestGroupService,
    TestGroupStore
  ]
})
export class TestGroupDataAccessModule {}
