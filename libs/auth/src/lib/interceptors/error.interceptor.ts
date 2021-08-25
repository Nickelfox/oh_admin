import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthFacade} from "../state/auth.facade";
import {HotToastService} from "@ngneat/hot-toast";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authFacade: AuthFacade,
    private hotToastService: HotToastService
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authFacade.logoutLocal();
          }
          const message = this.getServerErrorMessage(err);
          this.hotToastService.error(message, {
            dismissible: true,
            role: 'alert'
          });
        }
        return throwError(err);
      })
    );
  }

  // getClientErrorMessage(error: Error): string {
  //   return error.message ?
  //     error.message :
  //     error.toString();
  // }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine ?
      error.error.error?.message ? error.error.error.message : `${error.status}: ${error.statusText ? error.statusText : error.message}` :
      'No Internet Connection';
  }
}
