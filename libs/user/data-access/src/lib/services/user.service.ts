import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UserListingRequest, UserListingResponse, UserListingResponseData } from '../models/user.interface';
import { UserDetails } from '@hidden-innovation/shared/models';
import { UserBlockRequest, UserDetailsResponse } from '@hidden-innovation/user/user-details';

@Injectable()
export class UserService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  getUsers(reqObj: UserListingRequest): Observable<UserListingResponseData> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    return this.http.get<UserListingResponse>(`${this.env.baseURL}/v1/admin/getUser`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getUserDetails(userID: number): Observable<UserDetails> {
    return this.http.get<UserDetailsResponse>(`${this.env.baseURL}/v1/admin/getSingleUser/${userID}`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  blockUser(blockObj: UserBlockRequest): Observable<UserDetails> {
    return this.http.patch<UserDetailsResponse>(`${this.env.baseURL}/v1/admin/blockUser/${blockObj.id}`, blockObj.data).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
