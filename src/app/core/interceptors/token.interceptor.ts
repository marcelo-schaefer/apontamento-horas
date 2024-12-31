import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, take, timeout } from 'rxjs';

import { TokenService } from '../services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  return tokenService.obterToken().pipe(
    timeout(5000),
    take(1),
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
