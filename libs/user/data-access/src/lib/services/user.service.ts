import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import {
  UserBlockRequest,
  UserBlockResponse,
  UserDetailsResponse,
  UserListingRequest,
  UserListingResponse,
  UserListingResponseData
} from '../models/user.interface';
import { UserDetails } from '@hidden-innovation/shared/models';

@Injectable()
export class UserService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  getUsers(reqObj: UserListingRequest): Observable<UserListingResponseData> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString(),
      'name': reqObj.name ? reqObj.name : ''
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
    return this.http.patch<UserBlockResponse>(`${this.env.baseURL}/v1/admin/blockUser/${blockObj.id}`, blockObj.data).pipe(
      map(res => res.data.user),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
