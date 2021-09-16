import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { MaterialModule } from '@hidden-innovation/material';
import { Route, RouterModule } from '@angular/router';


export const userDetailComponent: Route[] = [{
  path: '',
  pathMatch: 'full',
  component: UserDetailsComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(userDetailComponent),],
  declarations: [
    UserDetailsComponent
  ],
})
export class UserDetailsModule {}
