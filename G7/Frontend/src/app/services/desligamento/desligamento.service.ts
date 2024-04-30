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
      id: environment.webServices.id,
      inputData: {
        server: environment.webServices.server,
        module: 'rubi',
        port: this.getMotivos,
        service: 'com.senior.automacao.hcm.desligamento',
        user: '',
        password: '',
        encryption: 1,
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
      id: environment.webServices.id,
      inputData: {
        server: environment.webServices.server,
        module: 'rubi',
        port: this.postSolicitacao,
        service: 'com.senior.automacao.hcm.desligamento',
        user: '',
        password: '',
        encryption: 1,
        ...dados,
      },
    };
    return this.http.post<RetornoPersisiteSolicitacao>(this.url, body);
  }
}
