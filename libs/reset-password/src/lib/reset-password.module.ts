import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Route, RouterModule} from '@angular/router';
import {ResetPasswordComponent} from './reset-password.component';
import {ResetPasswordStore} from './reset-password.store';
import {ResetPasswordService} from "./services/reset-password.service";
import {MaterialModule} from "@hidden-innovation/material";
import {AuthLayoutModule} from "@hidden-innovation/shared/ui/auth-layout";
import {UtilsModule} from "@hidden-innovation/shared/utils";

export const resetPasswordRoutes: Route[] = [{
  path: '',
  pathMatch: 'full',
  component: ResetPasswordComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(resetPasswordRoutes),
    MaterialModule,
    AuthLayoutModule,
    UtilsModule
  ],
  declarations: [ResetPasswordComponent],
  providers: [ResetPasswordStore, ResetPasswordService],
})
export class ResetPasswordModule {
}
