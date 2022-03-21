import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import {
  AssessmentEngagement,
  AssessmentEngagementResponse, AssessmentLimitRequest,
  DashboardData,
  DashboardResponse,
  PackEngagement,
  PackEngagementResponse, PackEngLimitRequest, PackEngLimitRequestResponseData,
  TestWatched, TestWatchedLimitRequest,
  TestWatchedListingResponse, TestWatchedListingResponseData
} from '../models/dashboard.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DashboardRangeFilterEnum } from '@hidden-innovation/shared/models';

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

  getTopWatched(reqObj:TestWatchedLimitRequest): Observable<TestWatchedListingResponseData> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    if (reqObj.resultlogSort) {
      params = params.append('resultlogSort', reqObj.resultlogSort);
    }
    if (reqObj.videoplaySort) {
      params = params.append('videoplaySort', reqObj.videoplaySort);
    }
    return this.http.get<TestWatchedListingResponse>(`${this.env.baseURL}/v1/admin/get-test-table`,{ params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getPackEng(reqObj:PackEngLimitRequest): Observable<PackEngLimitRequestResponseData> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    if (reqObj.contentclicksSort) {
      params = params.append('contentclicksSort', reqObj.contentclicksSort);
    }
    if (reqObj.resourceclicksSort) {
      params = params.append('resourceclicksSort', reqObj.resourceclicksSort);
    }
    if(reqObj.videoplaySort)
    {
      params.append('videoplaySort',reqObj.videoplaySort)
    }
    return this.http.get<PackEngagementResponse>(`${this.env.baseURL}/v1/admin/get-pack-table`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
  getAssessmentEng(reqObj:AssessmentLimitRequest): Observable<AssessmentEngagement[]> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    if (reqObj.completionSort) {
      params = params.append('completionSort', reqObj.completionSort);
    }
    if (reqObj.averagescoreSort) {
      params = params.append('averagescoreSort', reqObj.averagescoreSort);
    }
    return this.http.get<AssessmentEngagementResponse>(`${this.env.baseURL}/v1/admin/get-assessment-table`,{ params }).pipe(
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
  getRegisteredUsers(reqObj: {startDate: string; endDate: string, filterBy: DashboardRangeFilterEnum}): Observable<any> {
    let params = new HttpParams();
    let startDate = new Date(reqObj.startDate).toISOString();
    let endDate = new Date(reqObj.endDate).toISOString();
    if(reqObj.filterBy === DashboardRangeFilterEnum.MONTHLY){
      const year = new Date(startDate).getFullYear();
      const month = new Date(startDate).getMonth();
      startDate = new Date(year, month, 1).toISOString();
      endDate = new Date(year, month, new Date(year, month, 0).getDate()).toISOString();
    }
    params = params.appendAll({
      'startDate': startDate,
      'endDate': endDate
    });
    return this.http.get<DashboardResponse>(`${this.env.baseURL}/v1/admin/all-users`, {params}).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
  getActiveUsers(reqObj: {startDate: string; endDate: string, filterBy: DashboardRangeFilterEnum}): Observable<any> {
    let params = new HttpParams();
    let startDate = new Date(reqObj.startDate).toISOString();
    let endDate = new Date(reqObj.endDate).toISOString();
    if(reqObj.filterBy === DashboardRangeFilterEnum.MONTHLY){
      const year = new Date(startDate).getFullYear();
      const month = new Date(startDate).getMonth();
      startDate = new Date(year, month, 1).toISOString();
      endDate = new Date(year, month, new Date(year, month, 0).getDate()).toISOString();
    }
    params = params.appendAll({
      'startDate': startDate,
      'endDate': endDate
    });
    return this.http.get<DashboardResponse>(`${this.env.baseURL}/v1/admin/all-active-users`, {params}).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
}
