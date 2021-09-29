import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { UserUpdateRequest, UserUpdateResponse } from '@hidden-innovation/user/user-edit';
import { UserDetails } from '@hidden-innovation/shared/models';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class UserEditService {


  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  updateUserDetails(userObj: UserUpdateRequest, userID: number): Observable<UserDetails> {
    return this.http.post<UserUpdateResponse>(`${this.env.baseURL}/v1/admin/editUser/${userID}`, userObj).pipe(
      map(res => res.data.user),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
}
