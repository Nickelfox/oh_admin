import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Assessment,
  AssessmentCore,
  AssessmentListingResponse,
  AssessmentResponse,
  AssessmentResponseData,
  AssessmentUpdateResponse
} from '../models/assessment.interface';
import { TagCategoryEnum } from '@hidden-innovation/shared/models';

@Injectable()
export class AssessmentService {

  constructor(
    private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment
  ) {
  }

  getAssessmentList(): Observable<Assessment[]> {
    return this.http.get<AssessmentListingResponse>(`${this.env.baseURL}/v1/admin/get-all-assessment`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getAssessment(cat: TagCategoryEnum): Observable<AssessmentResponseData> {
    return this.http.get<AssessmentResponse>(`${this.env.baseURL}/v1/admin/get-assessment?category=${cat}`).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updateAssessment(assessmentObj: AssessmentCore): Observable<Assessment> {
    return this.http.post<AssessmentUpdateResponse>(`${this.env.baseURL}/v1/admin/create-assessment`, assessmentObj).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}

