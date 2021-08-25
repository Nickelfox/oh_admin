import {Inject, Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {LoginRequest, LoginResponse} from "../models/auth.interfaces";
import {Environment, ENVIRONMENT} from "@hidden-innovation/environment";
import {CustomApiResponse} from "@hidden-innovation/shared/models";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  login(loginObj: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.env.baseURL}/v1/admin/login`, loginObj).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  logout(): Observable<CustomApiResponse> {
    return of({
      message: 'Successfully Logged Out!',
      status: 200,
      data: {}
    });
    // return throwError('failed');
    // return this.http.post<LoginResponse>(`${this.env.baseURL}/v1/admin/login`, loginObj).pipe(
    //   catchError((err: HttpErrorResponse) => throwError(err))
    // );
  }

}
