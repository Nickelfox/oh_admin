import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataService {

  FIELD_NAME = {
    NAME: 'name',
    FIRST_NAME: 'first name',
    EMAIL_ID: 'email id',
    COUNTRY: 'country',
    LOCATION: 'location',
    DATE_OF_JOINING: 'date of joining',
    ONBOARD_DATE: 'onboard date',
    STATUS: 'status',
    ACTION: 'action',
    ID: 'id',
    USER_NAME: 'user name',
    LANGUAGE_DETAIL: 'language detail',
    ROLE: 'role',
    CREATED_AT: 'created at',
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
    UN_BLOCK: 'unblock'
  };

  CONST_NUMS = {
    TABLE_TEXT_LIMIT: 20
  };

  PaginatorData = {
    pageIndex: 1,
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10
  };
}
