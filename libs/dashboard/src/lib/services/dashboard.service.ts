import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { DashboardData, DashboardResponse } from '../models/dashboard.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class DashboardService {

  dashboardData!: DashboardResponse;

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  getStatistics(): Observable<DashboardData> {
    return this.http.get<DashboardResponse>(`${this.env.baseURL}/v1/admin/stats`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
  getGenderStatics(): Observable<any> {
    return this.http.get<DashboardResponse>(`${this.env.baseURL}/v1/admin/user-group`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
  getAllTestEngagement(): Observable<any> {
    return this.http.get<DashboardResponse>(`${this.env.baseURL}/v1/admin/all-test-engagement`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
  getAssessmentTestEngagement(): Observable<any> {
    return this.http.get<DashboardResponse>(`${this.env.baseURL}/v1/admin/all-assessment-engagement`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
}
