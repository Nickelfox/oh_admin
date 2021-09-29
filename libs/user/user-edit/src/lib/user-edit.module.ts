import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { UserDetailsService, UserDetailsStore } from '@hidden-innovation/user/user-details';
import { CommonFormFieldModule } from '@hidden-innovation/shared/ui/common-form-field';
import { SpinnerTextModule } from '@hidden-innovation/shared/ui/spinner-text';

export const userEditComponent: Route[] = [{
  path: '',
  pathMatch: 'full',
  component: UserEditComponent
}];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CommonFormFieldModule,
    SpinnerTextModule,
    RouterModule.forChild(userEditComponent)
  ],
  declarations: [
    UserEditComponent
  ],
  providers: [
    UserDetailsStore,
    UserDetailsService
  ]
})
export class UserEditModule {
}
