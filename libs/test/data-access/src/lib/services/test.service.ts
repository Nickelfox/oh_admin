import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { TestListingRequest, TestListingResponse, TestListingResponseData } from '@hidden-innovation/test/data-access';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

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
    if (reqObj.search && reqObj.search?.length) {
      params = params.append('search', reqObj.search);
    }
    if (reqObj.published !== undefined && reqObj.published !== null) {
      params = params.append('published', reqObj.published);
    }
    return this.http.get<TestListingResponse>(`${this.env.baseURL}/v1/admin/all-questionnaire`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
