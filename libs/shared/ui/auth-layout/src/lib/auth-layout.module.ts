import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthLayoutComponent} from './auth-layout.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AuthLayoutComponent
  ],
  exports: [AuthLayoutComponent]
})
export class AuthLayoutModule {
}
