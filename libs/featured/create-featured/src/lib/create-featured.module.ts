import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateFeaturedComponent } from './create-featured.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { RouterModule } from '@angular/router';
import {FeaturedDataAccessModule} from "@hidden-innovation/featured/data-access";
import {CommonFormFieldImageModule} from "@hidden-innovation/shared/ui/common-form-field-image";
import { PackContentCardModule } from '@hidden-innovation/shared/ui/pack-content-card';
import { TestDataAccessModule } from '@hidden-innovation/test/data-access';
import { TestGroupDataAccessModule } from '@hidden-innovation/test-group/data-access';
import { QuestionnaireDataAccessModule } from '@hidden-innovation/questionnaire/data-access';
import { PackDataAccessModule } from '@hidden-innovation/pack/data-access';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FeaturedDataAccessModule,
    CommonFormFieldModule,
    UtilsModule,
    TestDataAccessModule,
    TestGroupDataAccessModule,
    QuestionnaireDataAccessModule,
    PackDataAccessModule,
    CommonFormFieldImageModule,
    PackContentCardModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CreateFeaturedComponent
      }
    ])
  ],
  declarations: [
    CreateFeaturedComponent
  ],
})
export class CreateFeaturedModule {}
