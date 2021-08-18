import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login.component";
import {RouterModule} from "@angular/router";
import {MaterialModule} from "@hidden-innovation/material";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent
      }
    ]),
    MaterialModule,
  ],
  declarations: [
    LoginComponent
  ],
})
export class LoginModule {
}
