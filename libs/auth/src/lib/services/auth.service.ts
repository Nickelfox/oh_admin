import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {LoginRequest, LoginResponse} from "../models/auth.interfaces";
// import {environment} from "@env/environment";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(loginObj: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`sadf/v1/admin/login`, loginObj).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
