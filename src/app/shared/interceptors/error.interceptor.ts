import { Inject, Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  TuiAlertService,
  TuiDialogService,
  TuiNotification
} from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 429) {
          this.alertService
            .open(
              'С вашего устройства поступает слишком много запросов, попробуйте через 10 секунд',
              {
                label: 'Ошибка!',
                status: 'error' as TuiNotification
              }
            )
            .subscribe();
        }

        return throwError(error);
      })
    );
  }
}
