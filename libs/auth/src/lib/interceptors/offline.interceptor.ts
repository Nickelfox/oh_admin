import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { fromEvent, throwError } from 'rxjs';
import { mapTo, retryWhen, switchMap } from 'rxjs/operators';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {

  private onlineChanges$ = fromEvent(window, 'online').pipe(mapTo(true));

  get isOnline() {
    return navigator.onLine;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      retryWhen(errors => {
        if (this.isOnline) {
          return errors.pipe(switchMap(err => throwError(err)));
        }
        return this.onlineChanges$;
      })
    );
  }
}
