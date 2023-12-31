import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {AuthFacade} from '../state/auth.facade';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authFacade: AuthFacade) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authFacade.token$.pipe(
      take(1),
      switchMap((token) => {
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json')
          });
        }

        if (!token) {
          return next.handle(request);
        }
        const headers = request.headers.set('Authorization', `Bearer ${token}`);
        const authReq = request.clone({
          headers
        });
        return next.handle(authReq);
      })
    );
  }
}
