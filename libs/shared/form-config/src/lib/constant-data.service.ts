import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataService {

  FIELD_NAME = {
    NAME: 'name',
    EMAIL_ID: 'email id',
    COUNTRY: 'country',
    LOCATION: 'location',
    DATE_OF_JOINING: 'date of joining',
    STATUS: 'status',
    ACTION: 'action'
  };

  BUTTON_NAME = {

  };
}
