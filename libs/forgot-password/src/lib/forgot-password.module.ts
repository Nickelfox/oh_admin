import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgotPasswordComponent} from './forgot-password.component';
import {MaterialModule} from "@hidden-innovation/material";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    ForgotPasswordComponent
  ],
})
export class ForgotPasswordModule {
}
