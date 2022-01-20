import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AssessmentService} from "./services/assessment.service";
import {AssessmentStore} from "./store/assessment.store";

@NgModule({
  imports: [CommonModule],
  providers:[
    AssessmentService,
    AssessmentStore
  ]
})
export class AssessmentDataAccessModule {}
