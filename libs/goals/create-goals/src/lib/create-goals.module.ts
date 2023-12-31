import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGoalsComponent } from './create-goals.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonFormFieldImageModule } from '@hidden-innovation/shared/ui/common-form-field-image';
import { RouterModule } from '@angular/router';
import { CommonFormFieldTextareaModule } from '@hidden-innovation/shared/ui/common-form-field-textarea';
import { CommonFormFieldNumberModule } from '@hidden-innovation/shared/ui/common-form-field-number';
import { GoalDataAccessModule } from '@hidden-innovation/goals/data-access';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    UtilsModule,
    CommonFormFieldImageModule,
    GoalDataAccessModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CreateGoalsComponent
      }
    ]),
    CommonFormFieldTextareaModule,
    CommonFormFieldNumberModule
  ],
  declarations: [
    CreateGoalsComponent
  ],
})
export class CreateGoalsModule {}
