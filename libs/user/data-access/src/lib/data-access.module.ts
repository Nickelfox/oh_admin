import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from './store/user.store';
import { UserService } from './services/user.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    UserService,
    UserStore,
  ],
})
export class UserDataAccessModule {}
