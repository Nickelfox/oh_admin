import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Tag, TagsListingRequest, TagsListingResponse } from '../models/tags.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@UntilDestroy()
@Injectable()
export class TagsService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  getTags(reqObj: TagsListingRequest): Observable<{ tags: Tag[]; total: number }> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': reqObj.page.toString(),
      'limit': reqObj.limit.toString()
    });
    return this.http.get<TagsListingResponse>(`${this.env.baseURL}/v1/admin/get-tags`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
}
