import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateFeaturedComponent } from './create-featured.component';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { UtilsModule } from '@hidden-innovation/shared/utils';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    UtilsModule,
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
