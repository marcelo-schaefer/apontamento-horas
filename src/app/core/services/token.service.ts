import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  tap,
  timeout,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token$ = new BehaviorSubject<Token | undefined>(undefined);

  carregarToken(): Observable<void> {
    return fromEvent(window, 'message').pipe(
      map<any, Token>((evento) => {
        console.log(evento);
        return {
          accessToken: evento.data.token.access_token,
          tokenType: evento.data.token.token_type,
        };
      }),
      tap((token) => {
        this.token$.next(token);
      }),
      map(() => undefined)
    );
  }

  obterToken(): Observable<Token> {
    const token = this.token$.getValue();

    return token !== undefined
      ? of(token)
      : fromEvent(window, 'message').pipe(
          timeout(5000),
          map<any, Token>((evento) => {
            console.log(evento);
            return {
              accessToken: evento.data.token.access_token,
              tokenType: evento.data.token.token_type,
            };
          }),
          tap((token) => {
            this.token$.next(token);
          })
        );
  }
}

export interface Token {
  accessToken: string;
  tokenType: string;
}
