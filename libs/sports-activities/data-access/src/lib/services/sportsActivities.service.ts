import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SportActivities, SportActivitiesCore, SportActivitiesResponse } from '../models/sportsActivities.interface';

@Injectable()
export class SportActivitiesService {

  constructor(
    private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment
  ) {
  }

  getGoal(): Observable<SportActivities> {
    return this.http.get<SportActivitiesResponse>(`${this.env.baseURL}/v1/admin/get-goal-question`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updateGoal(sportActivitiesObj: SportActivitiesCore): Observable<SportActivities> {
    return this.http.post<SportActivitiesResponse>(`${this.env.baseURL}/v1/admin/goal/create`, sportActivitiesObj).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
