import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { EditAdminProfileState } from '../edit-admin-profile.store';
import { EditAdminProfileResponse } from '../models/edit-admin-profile.interface';

@Injectable()
export class EditAdminProfileService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  // editAdminProfile(profileObj: EditAdminProfileState): void {
  //   return this.http.post<EditAdminProfileResponse>(`${this.env.baseURL}/v1/admin/changePassword`)
  // }

}
