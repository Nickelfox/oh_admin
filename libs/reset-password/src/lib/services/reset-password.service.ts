import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ResetPasswordState} from "../reset-password.store";
import {ResetPasswordResponse} from '@hidden-innovation/reset-password';
import {Environment, ENVIRONMENT} from "@hidden-innovation/environment";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable()
export class ResetPasswordService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  resetPassword(resetObj: ResetPasswordState): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${this.env.baseURL}/v1/admin/verifyOtp`, resetObj).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
