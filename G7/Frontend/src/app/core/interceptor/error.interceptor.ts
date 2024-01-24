import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
          if (error.status === 403) {
            this.forbiddenNotification();
          } else {
            if (error.status === 500) {
              this.badRequestNotification(error);
            }
          }
        }

        return throwError(errorMessage);
      })
    );
  }

  forbiddenNotification(): void {
    this.notification.blank(
      'Acesso Não Autorizado',
      'Tente logar novamente ou contacte o administrador do sistema.',
      {
        nzDuration: 0,
        nzStyle: {
          width: '600px',
          marginLeft: '-265px',
          background: '#fff1f0',
          border: '1px solid #ffa39e',
        },
        nzClass: 'test-class',
      }
    );
  }

  badRequestNotification(error: HttpErrorResponse): void {
    this.notification.create(
      'error',
      'Falha ao se comunicar com o Servidor',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error.error.message
    );
  }
}
