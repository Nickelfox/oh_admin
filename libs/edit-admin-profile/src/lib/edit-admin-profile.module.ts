import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAdminProfileComponent } from './edit-admin-profile.component';
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [CommonModule, RouterModule.forChild([{
    path: '',
    pathMatch: 'full',
    component: EditAdminProfileComponent
  }])],
  declarations: [
    EditAdminProfileComponent
  ],
})
export class EditAdminProfileModule {}
