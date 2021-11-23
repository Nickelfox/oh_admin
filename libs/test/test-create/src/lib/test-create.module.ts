import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCreateComponent } from './test-create.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: TestCreateComponent
      }
    ]),
  ],
  declarations: [
    TestCreateComponent
  ],
})
export class TestCreateModule {}
