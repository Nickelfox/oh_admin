import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAdminProfileComponent } from './edit-admin-profile.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@hidden-innovation/material';
import { EditAdminProfileService } from './services/edit-admin-profile.service';
import { EditAdminProfileStore } from './edit-admin-profile.store';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: EditAdminProfileComponent,
      },
    ]),
  ],
  declarations: [EditAdminProfileComponent],
  providers: [
    EditAdminProfileService,
    EditAdminProfileStore,
  ],
})
export class EditAdminProfileModule {}
