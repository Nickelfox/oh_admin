import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { EditAdminProfileState } from '../edit-admin-profile.store';
import { EditAdminProfileResponse } from '../models/edit-admin-profile.interface';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class EditAdminProfileService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  editAdminProfile(profileObj: EditAdminProfileState, adminID: number | undefined): Observable<EditAdminProfileResponse> {
    return this.http.post<EditAdminProfileResponse>(`${this.env.baseURL}/v1/admin/changeDetails/${adminID}`, profileObj).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
