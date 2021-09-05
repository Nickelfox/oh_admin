import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EditAdminProfileRequest } from './models/edit-admin-profile.interface';

export interface EditAdminProfileState extends Partial<EditAdminProfileRequest>{
  isLoading?: boolean;
}

const initialState: EditAdminProfileState = {
  isLoading: false
};

@Injectable()
export class EditAdminProfileStore extends ComponentStore<EditAdminProfileState> {
  constructor() {
    super(initialState);
  }
}
