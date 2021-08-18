import {Inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {LoginRequest, LoginResponse} from "../models";
import {APP_CONFIG, AppConfig} from "@hidden-innovation/shared/app-config";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {
  }

  login(loginObj: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.appConfig.baseURL}/v1/admin/login`, loginObj).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
