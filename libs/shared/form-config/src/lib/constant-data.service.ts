import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataService {

  FIELD_NAME = {
    NAME: 'name',
    TYPE: 'type',
    FIRST_NAME: 'first name',
    EMAIL_ID: 'email id',
    COUNTRY: 'country',
    LOCATION: 'location',
    DATE_OF_JOINING: 'date of joining',
    DATE_ADDED: 'date added',
    DATE_MODIFIED: 'date modified',
    QUESTIONS: 'questions',
    SCORING: 'scoring',
    ONBOARD_DATE: 'onboard date',
    STATUS: 'status',
    ACTION: 'action',
    ID: 'id',
    USER_NAME: 'user name',
    LANGUAGE_DETAIL: 'language detail',
    ROLE: 'role',
    CREATED_AT: 'created at',
    CATEGORY: 'category',
    UPDATED_AT: 'updated at',
    HEIGHT: 'height',
    WEIGHT: 'weight',
    SEX: 'sex',
    SKIN_COLOUR: 'skin colour',
    WATCHED: 'watched',
    COMPLETED: 'completed',
    INPUTS: 'inputs',
    STARTED: 'started',
    RESULTS: 'results',
    OCS: 'ocs',
    OOS: 'oos',
    AGE: 'age',
    GENDER: 'gender'
  };

  BUTTON_NAME = {
    VIEW: 'view',
    DELETE: 'delete',
    UPDATE: 'update',
    EDIT: 'edit',
    CREATE: 'create',
    CANCEL: 'cancel',
    BLOCK: 'block',
    UN_BLOCK: 'unblock',
    ACTIVATE: 'activate',
    DEACTIVATE: 'deactivate',
    SAVE: 'save'
  };

  CONST_NUMS = {
    TABLE_TEXT_LIMIT: 20
  };

  public PaginatorData = {
    pageIndex: 1,
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10
  };

  public FIZE_SIZE_DATA = {
    limit: 52428800,
    limitMessage: 'File must be smaller than 50MB.',
  };

}
