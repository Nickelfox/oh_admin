import {HttpStatusCode} from "@angular/common/http";

export interface Paginator {
  currentPage: number;
  nextPage: number;
  prevPage: number;
  totalPages: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CustomApiResponse {
  status: HttpStatusCode;
  message: string;
  data: any;
}
