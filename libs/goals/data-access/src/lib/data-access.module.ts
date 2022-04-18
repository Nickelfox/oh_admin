import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsService } from './services/goals.service';
import { GoalStore } from './store/goals.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    GoalsService,
    GoalStore
  ],
})
export class GoalDataAccessModule {}
