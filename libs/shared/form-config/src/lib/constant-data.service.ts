import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataService {

  FIELD_NAME = {
    NAME: 'name',
    TEST_NAME: 'test name',
    TYPE: 'type',
    FIRST_NAME: 'first name',
    FILE_NAME: 'file name',
    EMAIL_ID: 'email id',
    EQUIPMENT: 'equipment',
    COUNTRY: 'country',
    LOCATION: 'location',
    LABEL: 'label',
    LESSON: 'lesson',
    DATE_OF_JOINING: 'date of joining',
    DATE_ADDED: 'date added',
    DESC: 'description',
    DATE_MODIFIED: 'date modified',
    OPTIONS: 'options',
    QUESTIONS: 'questions',
    SCORING: 'scoring',
    ONBOARD_DATE: 'onboard date',
    STATUS: 'status',
    ACTION: 'action',
    ID: 'id',
    USER_NAME: 'user name',
    THUMBNAIL: 'thumbnail',
    LANGUAGE_DETAIL: 'language detail',
    ROLE: 'role',
    CREATED_AT: 'created at',
    CATEGORY: 'category',
    DIFFICULTY: 'difficulty',
    UPDATED_AT: 'updated at',
    HEIGHT: 'height',
    OUTCOMES: 'outcomes',
    PROCEDURE: 'procedure',
    WEIGHT: 'weight',
    SUBCATEGORIE_S: 'subcategories(s)',
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
    GENDER: 'gender',
    VIDEO_FILE: 'video file',
    RESULT_EXPLANATION: 'result explanation',
    HEADING: 'Heading',
    SUB_HEADING: 'Subheading',
    BOTTOM_TEXT: 'Bottom Text',
    RAIL_NAME: 'Rail Name'
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
    videoFormatMessage: 'Only MOV & MP4 formats are allowed',
    videoRatioMessage: 'Video file must be in 16:9 aspect ratio',
    fileFormatMessage: 'Invalid File! Please select an appropriate file to upload .i.e. pdf, jpg, jpeg, png'
  };

  public FILE_FORMAT_DATA = {
    video_mp4: 'video/mp4',
    video_mov: 'video/quicktime',
    image_png: 'image/png',
    image_jpg: 'image/jpg',
    image_jpeg: 'image/jpeg',
    pdf: 'application/pdf',
    // Application Type
    application: 'application',
    audio: 'audio',
    image: 'image',
    text: 'text',
    video: 'video'
  }

}
