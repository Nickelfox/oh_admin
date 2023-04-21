import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoalResponse, Goals, GoalsCore } from '../models/goals.interface';
import {CustomApiResponse} from "@hidden-innovation/shared/models";

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

  updateGoal(goalObj: GoalsCore): Observable<Goals> {
    return this.http.post<GoalResponse>(`${this.env.baseURL}/v1/admin/goal/create`, goalObj).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  deleteGoalAnswer(id: number | undefined): Observable<CustomApiResponse> {
    return this.http.delete<CustomApiResponse>(`${this.env.baseURL}/v1/admin/deleteGoalAnswer/${id}`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
