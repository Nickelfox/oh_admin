import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UserListingRequest, UserListingResponse, UserListingResponseData } from '../models/user-listing.interface';

@Injectable()
export class UserListingService {

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

}
