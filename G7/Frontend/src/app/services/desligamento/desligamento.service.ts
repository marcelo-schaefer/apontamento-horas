import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RetornoMotivoDesligamento } from './models/motivo-desligamento';
import {
  PersisiteSolicitacao,
  RetornoPersisiteSolicitacao,
} from './models/persisite-solicitacao';

@Injectable({
  providedIn: 'root',
})
export class DesligamentoService {
  private getMotivos = 'retornaMotivosDesligamento';
  private postSolicitacao = 'persisitirSolicitacao';
  private url = environment.plugin.invoke;

  constructor(private http: HttpClient) {}

  buscaMotivosDesliagmento(): Observable<RetornoMotivoDesligamento> {
    if (!environment.production)
      return this.http.get<RetornoMotivoDesligamento>(
        this.url + this.getMotivos
      );

    const body = {
      id: environment.webService.id,
      configurationId: environment.webService.configurationId,
      inputData: {
        server: environment.webService.baseUrl,
        module: environment.webService.module,
        port: this.getMotivos,
        service: environment.webService.service,
        user: '',
        password: '',
        encryption: environment.webService.encryption,
      },
    };
    return this.http.post<RetornoMotivoDesligamento>(this.url, body);
  }

  persisitirSolicitacao(
    dados: PersisiteSolicitacao
  ): Observable<RetornoPersisiteSolicitacao> {
    if (!environment.production)
      return this.http.get<RetornoMotivoDesligamento>(
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
    return this.http.post<RetornoPersisiteSolicitacao>(this.url, body);
  }
}
