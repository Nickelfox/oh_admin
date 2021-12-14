import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService } from './services/test.service';
import { TestStore } from './store/test.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    TestService,
    TestStore
  ]
})
export class TestDataAccessModule {}
