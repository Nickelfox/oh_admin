import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "@hidden-innovation/material";
import {ChangePasswordService} from "./services/change-password.service";
import {ChangePasswordStore} from "./change-password.store";

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
  providers: [
    ChangePasswordService,
    ChangePasswordStore
  ]
})
export class ChangePasswordModule {}
