import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportActivitiesStore } from './store/sportsActivities.store';
import { SportActivitiesService } from './services/sportsActivities.service';

@NgModule({
  imports: [CommonModule],
  providers:[
    SportActivitiesStore,
    SportActivitiesService
  ]
})
export class SportActivitiesDataAccessModule {}
