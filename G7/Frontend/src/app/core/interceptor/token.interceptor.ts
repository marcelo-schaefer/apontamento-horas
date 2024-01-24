import { environment } from 'src/environments/environment';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkflowService } from '../service/workflow/workflow.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private workflowService: WorkflowService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const BEARER_TOKEN = this.workflowService.getToken();
    const USER = this.workflowService.getUser().username;

    if (
      req.url.startsWith(environment.domains.platform) ||
      req.url.startsWith(environment.webService.baseUrl)
    ) {
      req = req.clone({
        headers: req.headers
          .set('Authorization', BEARER_TOKEN)
          .set('user', USER),
      });
    }

    return next.handle(req);
  }
}
