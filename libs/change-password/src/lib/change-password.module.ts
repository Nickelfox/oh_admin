import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "@hidden-innovation/material";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([{
      path: '',
      pathMatch: 'full',
      component: ChangePasswordComponent,
    }])
  ],
  declarations: [
    ChangePasswordComponent
  ],
})
export class ChangePasswordModule {}
