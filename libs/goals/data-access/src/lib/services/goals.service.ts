import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { GoalResponse, Goals } from '@hidden-innovation/goals/data-access';

@Injectable()
export class GoalsService {

  constructor(
    private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment
  ) {
  }

  getGoal(): Observable<Goals> {
    return this.http.get<GoalResponse>(`${this.env.baseURL}/v1/admin/get-goal-question`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
