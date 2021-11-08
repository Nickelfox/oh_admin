import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
import { Environment, ENVIRONMENT } from '@hidden-innovation/environment';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {

  constructor(
    private injector: Injector,
    @Inject(ENVIRONMENT) private env: Environment) {
  }

  // Accept error and show error as a toast notification
  handleError(error: Error | HttpErrorResponse): void {
    const errorService = this.injector.get(ErrorService);
    const notifier = this.injector.get(HotToastService);
    let message;

    if (error instanceof HttpErrorResponse) {
      message = errorService.getServerErrorMessage(error);
      notifier.error(message);
    } else {
      message = errorService.getClientErrorMessage(error);
      if (!this.env.production) {
        console.log(message);
      }
      notifier.error('Application Error');
      console.error(error);
    }
  }

}
