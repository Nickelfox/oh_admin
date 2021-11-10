import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import {
  CreateQuestionnaireResponse,
  Questionnaire,
  QuestionnaireListingRequest,
  QuestionnaireListingResponse,
  QuestionnaireListingResponseData
} from '../models/questionnaire.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()

export class QuestionnaireService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  getQuestionnaires(reqObj: QuestionnaireListingRequest): Observable<QuestionnaireListingResponseData> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    return this.http.get<QuestionnaireListingResponse>(`${this.env.baseURL}/v1/admin/all-questionnaire`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  createQuestionnaire(reqObj: Questionnaire): Observable<Questionnaire> {
    return this.http.post<CreateQuestionnaireResponse>(`${this.env.baseURL}/v1/admin/create-questionnaire`, reqObj).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
