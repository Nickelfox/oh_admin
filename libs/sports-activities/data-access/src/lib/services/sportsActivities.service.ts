import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SportActivities, SportActivitiesCore, SportActivitiesResponse } from '../models/sportsActivities.interface';
import {CustomApiResponse} from "@hidden-innovation/shared/models";

@Injectable()
export class SportActivitiesService {

  constructor(
    private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment
  ) {
  }

  getSportsActivities(): Observable<SportActivities> {
    return this.http.get<SportActivitiesResponse>(`${this.env.baseURL}/v1/admin/get-activity-question`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updateSportsActivities(sportActivitiesObj: SportActivitiesCore): Observable<SportActivities> {
    return this.http.post<SportActivitiesResponse>(`${this.env.baseURL}/v1/admin/activity/create`, sportActivitiesObj).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  deleteSportsActivities(id: number | undefined): Observable<CustomApiResponse> {
    return this.http.delete<CustomApiResponse>(`${this.env.baseURL}/v1/admin/deleteActivityAnswer/${id}`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
