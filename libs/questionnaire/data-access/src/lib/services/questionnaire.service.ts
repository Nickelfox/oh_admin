import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import {
  CreateQuestionnaireResponse,
  Questionnaire,
  QuestionnaireExtended,
  QuestionnaireListingRequest,
  QuestionnaireListingResponse,
  QuestionnaireListingResponseData,
  QuestionnaireResponse,
  UpdateQuestionnaireResponse
} from '../models/questionnaire.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomApiResponse } from '@hidden-innovation/shared/models';

@UntilDestroy()
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
    if (reqObj.nameSort) {
      params = params.append('nameSort', reqObj.nameSort);
    }
    if (reqObj.dateSort) {
      params = params.append('dateSort', reqObj.dateSort);
    }
    if (reqObj.search && reqObj.search?.length) {
      params = params.append('search', reqObj.search);
    }
    if (reqObj.scoring !== undefined && reqObj.scoring !== null) {
      params = params.append('scoring', reqObj.scoring);
    }
    if (reqObj.active !== undefined && reqObj.active !== null) {
      params = params.append('active', reqObj.active);
    }
    return this.http.get<QuestionnaireListingResponse>(`${this.env.baseURL}/v1/admin/all-questionnaire`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  getQuestionnaire(id: number): Observable<QuestionnaireExtended> {
    return this.http.get<QuestionnaireResponse>(`${this.env.baseURL}/v1/admin/questionnaire/${id}`).pipe(
      map(res => res.data.questionnaire),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  createQuestionnaire(reqObj: Questionnaire): Observable<QuestionnaireExtended> {
    return this.http.post<CreateQuestionnaireResponse>(`${this.env.baseURL}/v1/admin/create-questionnaire`, reqObj).pipe(
      map(res => res.data.questionnaire),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updateQuestionnaire(reqObj: Questionnaire, id: number): Observable<QuestionnaireExtended> {
    return this.http.post<UpdateQuestionnaireResponse>(`${this.env.baseURL}/v1/admin/update-questionnaire/${id}`, reqObj).pipe(
      map(res => res.data.questionnaire),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  toggleActiveQuestionnaire(id: number): Observable<CustomApiResponse> {
    return this.http.patch<CustomApiResponse>(`${this.env.baseURL}/v1/admin/activate-deactivate/${id}`, {}).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  deleteQuestionnaire(id: number): Observable<CustomApiResponse> {
    return this.http.delete<CustomApiResponse>(`${this.env.baseURL}/v1/admin/delete-questionnaire/${id}`).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

}
