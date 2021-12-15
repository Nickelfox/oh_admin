import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { TestService } from './services/test.service';
import { TestStore } from './store/test.store';
import { TestUtilitiesService } from './services/test-utilities.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    TestService,
    TestStore,
    TitleCasePipe,
    TestUtilitiesService,
  ]
})
export class TestDataAccessModule {}
