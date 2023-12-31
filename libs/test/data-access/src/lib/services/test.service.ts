import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import {
  CreateTest,
  CreateTestResponse,
  Test,
  TestListingRequest,
  TestListingResponse,
  TestListingResponseData,
  TestResponse
} from '../models/test.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CustomApiResponse } from '@hidden-innovation/shared/models';

@Injectable()
export class TestService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  getTests(reqObj: TestListingRequest): Observable<TestListingResponseData> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    if (reqObj.nameSort) {
      params = params.append('nameSort', reqObj.nameSort);
    }
    if (reqObj.dateSort) {
      params = params.append('dateSort', reqObj.dateSort);
    }
    if (reqObj.category && reqObj.category.length) {
      params = params.append('category', reqObj.category.join(','));
    }
    if (reqObj.type && reqObj.type.length) {
      params = params.append('type', reqObj.type.join(','));
    }
    if (reqObj.level && reqObj.level.length) {
      params = params.append('level', reqObj.level.join(','));
    }
    if (reqObj.search && reqObj.search?.length) {
      params = params.append('search', reqObj.search);
    }
    if (reqObj.published !== undefined && reqObj.published !== null) {
      params = params.append('published', reqObj.published);
    }
    return this.http.get<TestListingResponse>(`${this.env.baseURL}/v1/admin/all-test`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  createTest(testObj: CreateTest): Observable<Test> {
    return this.http.post<CreateTestResponse>(`${this.env.baseURL}/v1/admin/create-test`, testObj).pipe(
      map(res => res.data.test),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getTest(id: number): Observable<Test> {
    return this.http.get<TestResponse>(`${this.env.baseURL}/v1/admin/test/${id}`).pipe(
      map(res => res.data.test),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updateTest(testObj: CreateTest, id: number): Observable<Test> {
    return this.http.patch<TestResponse>(`${this.env.baseURL}/v1/admin/update-test/${id}`, testObj).pipe(
      map(res => res.data.test),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  toggleTestPublishStatus(id: number): Observable<CustomApiResponse> {
    return this.http.patch<CustomApiResponse>(`${this.env.baseURL}/v1/admin/publish-test/${id}`, {}).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  deleteTest(id: number): Observable<CustomApiResponse> {
    return this.http.delete<CustomApiResponse>(`${this.env.baseURL}/v1/admin/delete-test/${id}`).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
