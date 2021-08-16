import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {Auth} from "../models";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<{ data: Auth }> {
    return this.http.post<{ data: Auth }>('https://dev.api.psychscope.app/v1/user/admin/login', {
      email: email,
      password: password
    }).pipe(
      catchError(err => throwError(err))
    );
  }
}
