import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Environment, ENVIRONMENT} from "@hidden-innovation/environment";
import {ChangePasswordState} from "../change-password.store";
import {ChangePasswordResponse} from "../models/change-password.interface";
import {catchError} from "rxjs/operators";
import {Observable, throwError} from "rxjs";

@Injectable()
export class ChangePasswordService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  changePassword(passObj: ChangePasswordState): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(`${this.env.baseURL}/v1/admin/changePassword`, passObj).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    )
  }

}
