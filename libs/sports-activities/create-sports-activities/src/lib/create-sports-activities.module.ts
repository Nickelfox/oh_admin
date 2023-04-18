import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSportsActivitiesComponent } from './create-sports-activities.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { CommonFormFieldImageModule } from '@hidden-innovation/shared/ui/common-form-field-image';
import { RouterModule } from '@angular/router';
import { CommonFormFieldTextareaModule } from '@hidden-innovation/shared/ui/common-form-field-textarea';
import { CommonFormFieldNumberModule } from '@hidden-innovation/shared/ui/common-form-field-number';
import { SportActivitiesDataAccessModule } from '@hidden-innovation/sports-activities/data-access';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    UtilsModule,
    CommonFormFieldImageModule,
    SportActivitiesDataAccessModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CreateSportsActivitiesComponent
      }
    ]),
    CommonFormFieldTextareaModule,
    CommonFormFieldNumberModule
  ],
  declarations: [
    CreateSportsActivitiesComponent
  ],
})
export class CreateSportsActivitiesModule {}
