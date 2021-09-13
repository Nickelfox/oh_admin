import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) {
  }

  // getStatistics(): void {
  //   return this.
  // }
}
