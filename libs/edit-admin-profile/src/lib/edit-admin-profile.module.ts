import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAdminProfileComponent } from './edit-admin-profile.component';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "@hidden-innovation/material";

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule.forChild([{
    path: '',
    pathMatch: 'full',
    component: EditAdminProfileComponent
  }])],
  declarations: [
    EditAdminProfileComponent
  ],
})
export class EditAdminProfileModule {}
