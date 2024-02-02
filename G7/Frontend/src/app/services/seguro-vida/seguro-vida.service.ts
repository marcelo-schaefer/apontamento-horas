import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RetornoPlanoSeguroVida } from './models/plano-seguro-vida';
import { Observable } from 'rxjs';
import { RetornoParentesco } from './models/parentesco';
import {
  PersisteSolicitacao,
  RetornoPersisteSolicitacao,
} from './models/persiste-solicitacao';

@Injectable({
  providedIn: 'root',
})
export class SeguroVidaService {
  private getPlanoSeguroVida = 'planoSeguroVida';
  private getGrauParentescos = 'buscaGrauParentescos';
  private postSolicitacao = 'persisteSolicitacao';
  private url = environment.plugin.invoke;

  constructor(private http: HttpClient) {}

  buscaPlanoSeguroVida(
    usuarioSolicitante: string
  ): Observable<RetornoPlanoSeguroVida> {
    if (!environment.production)
      return this.http.get<RetornoPlanoSeguroVida>(
        this.url + this.getPlanoSeguroVida
      );

    const body = {
      id: environment.webService.id,
      configurationId: environment.webService.configurationId,
      inputData: {
        server: environment.webService.baseUrl,
        module: environment.webService.module,
        port: this.getPlanoSeguroVida,
        service: environment.webService.service,
        user: '',
        password: '',
        encryption: environment.webService.encryption,
        aUsuarioSolicitante: usuarioSolicitante,
      },
    };
    return this.http.post<RetornoPlanoSeguroVida>(this.url, body);
  }

  buscaGrauParentescos(): Observable<RetornoParentesco> {
    if (!environment.production)
      return this.http.get<RetornoParentesco>(
        this.url + this.getGrauParentescos
      );

    const body = {
      id: environment.webService.id,
      configurationId: environment.webService.configurationId,
      inputData: {
        server: environment.webService.baseUrl,
        module: environment.webService.module,
        port: this.getGrauParentescos,
        service: environment.webService.service,
        user: '',
        password: '',
        encryption: environment.webService.encryption,
      },
    };
    return this.http.post<RetornoParentesco>(this.url, body);
  }

  persistirSolicitacao(
    dados: PersisteSolicitacao
  ): Observable<RetornoPersisteSolicitacao> {
    if (!environment.production)
      return this.http.get<RetornoPersisteSolicitacao>(
        this.url + this.postSolicitacao
      );

    const body = {
      id: environment.webService.id,
      configurationId: environment.webService.configurationId,
      inputData: {
        server: environment.webService.baseUrl,
        module: environment.webService.module,
        port: this.postSolicitacao,
        service: environment.webService.service,
        user: '',
        password: '',
        encryption: environment.webService.encryption,
        ...dados,
      },
    };
    return this.http.post<RetornoPersisteSolicitacao>(this.url, body);
  }
}
