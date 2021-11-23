import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CreateTagResponse, Tag, TagCore, TagsListingRequest, TagsListingResponse } from '../models/tags.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CustomApiResponse } from '@hidden-innovation/shared/models';

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
    if (reqObj.type && reqObj.type.length) {
      params = params.append('type', reqObj.type.join(','));
    }
    if (reqObj.category && reqObj.category.length) {
      params = params.append('category', reqObj.category.join(','));
    }
    if (reqObj.nameSort) {
      params = params.append('nameSort', reqObj.nameSort);
    }
    if (reqObj.dateSort) {
      params = params.append('dateSort', reqObj.dateSort);
    }
    if (reqObj.search && reqObj.search?.length) {
      params = params.append('search', reqObj.search);
    }
    return this.http.get<TagsListingResponse>(`${this.env.baseURL}/v1/admin/get-tags`, { params }).pipe(
      map(res => res.data),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  createTag(tagObj: TagCore): Observable<Tag> {
    return this.http.post<CreateTagResponse>(`${this.env.baseURL}/v1/admin/create-tag`, tagObj).pipe(
      map(res => res.data.tag),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  updateTag(tagObj: Tag): Observable<Tag> {
    const { name, tagType, categoryName, id } = tagObj;
    const updatedTagObj: TagCore = {
      name,
      tagType,
      categoryName
    };
    return this.http.patch<CreateTagResponse>(`${this.env.baseURL}/v1/admin/tag/${id}`, updatedTagObj).pipe(
      map(res => res.data.tag),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  deleteTag(id: number): Observable<CustomApiResponse> {
    return this.http.delete<CustomApiResponse>(`${this.env.baseURL}/v1/admin/tag/${id}`).pipe(
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }
}
