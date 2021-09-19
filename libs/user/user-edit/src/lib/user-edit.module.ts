import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';




export const userEditComponent: Route[] = [{
  path: '',
  pathMatch: 'full',
  component: UserEditComponent,
}];

@NgModule({
  imports: [CommonModule,
    MaterialModule,
    RouterModule.forChild(userEditComponent),
  ],
  declarations: [
    UserEditComponent
  ],
})
export class UserEditModule {}
