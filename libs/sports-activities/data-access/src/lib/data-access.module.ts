import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalStore } from '@hidden-innovation/goals/data-access';
import { SportActivitiesStore } from './store/sport-activities.store';
import { SportActivitiesService } from './services/sport-activities.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    SportActivitiesStore,
    SportActivitiesService
  ],
})
export class DataAccessModule {}
