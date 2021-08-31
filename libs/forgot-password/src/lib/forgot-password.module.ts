import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgotPasswordComponent} from './forgot-password.component';
import {MaterialModule} from "@hidden-innovation/material";
import { Route, RouterModule } from '@angular/router';
import { AuthLayoutModule } from '@hidden-innovation/shared/ui/auth-layout';



export const forgotPasswordRoutes: Route[] = [{
  path: '',
  pathMatch: 'full',
  component: ForgotPasswordComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(forgotPasswordRoutes),
    MaterialModule,
    AuthLayoutModule
  ],
  declarations: [
    ForgotPasswordComponent
  ],
})
export class ForgotPasswordModule {
}
