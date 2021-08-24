import {Inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {LoginRequest, LoginResponse} from "../models/auth.interfaces";
import {Environment, ENVIRONMENT} from "@hidden-innovation/environment";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  login(loginObj: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.env.baseURL}/v1/admin/login`, loginObj).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
