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
  };

  BUTTON_NAME = {
    VIEW: 'view',
    DELETE: 'delete',
    UPDATE: 'update',
    EDIT: 'edit',
    CREATE: 'create',
  };

  CONST_NUMS = {
    TABLE_TEXT_LIMIT: 20
  };

}
