import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthFacade } from '../state/auth.facade';
import { HotToastService } from '@ngneat/hot-toast';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const hotToastService = this.injector.get(HotToastService);
        const errorService = this.injector.get(ErrorService);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            const authFacade = this.injector.get(AuthFacade);
            authFacade.logoutLocal();
          }
          const message = errorService.getServerErrorMessage(err);
          hotToastService.error(message, {
            dismissible: true,
            role: 'alert'
          });
        }
        return throwError(err);
      })
    );
  }


}
