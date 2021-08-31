import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Environment, ENVIRONMENT} from "@hidden-innovation/environment";
import {ForgotPasswordState} from "../forgot-password.store";
import {ForgotPasswordResponse} from "../models/forgot-password.interface";
import {catchError} from "rxjs/operators";
import {Observable, throwError} from "rxjs";

@Injectable()
export class ForgotPasswordService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  forgotPassword(forgotObj: ForgotPasswordState): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.env.baseURL}/v1/admin/forgotPassword`, forgotObj).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    )
  }
}
