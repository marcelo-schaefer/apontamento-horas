import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { retry, switchMap, take, timeout } from 'rxjs';

import { TokenService } from '../services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  return tokenService.obterToken().pipe(
    timeout(15000),
    take(1),
    retry(3),
    switchMap((token) => {
      req = req.clone({
        setHeaders: {
          Authorization: `${token.tokenType} ${token.accessToken}`,
        },
      });

      return next(req);
    })
  );
};
