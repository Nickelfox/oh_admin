import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { UserDetailsResponse } from '@hidden-innovation/user/user-details';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserDetails } from '@hidden-innovation/shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  getUserDetails(userID: number): Observable<UserDetails> {
    let params = new HttpParams();
    params = params.append('id', userID);
    return this.http.get<UserDetailsResponse>(`${this.env.baseURL}/v1/admin/getSingleUser`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
}
