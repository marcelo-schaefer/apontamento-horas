import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  PersistirPrevidencia,
  RetornoPersistirPrevidencia,
} from './models/persistir-previdencia';
import { RetornoPossuiPrevidencia } from './models/possui-previdencia';

@Injectable({
  providedIn: 'root',
})
export class PrevidenciaPrivadaService {
  private getPossuiPrevidencia = 'colaboradorPossuiPrevidencia';
  private postSolicitacao = 'persisteSolicitacao';

  private url = environment.plugin.invoke;

  constructor(private http: HttpClient) {}

  buscaPossuiPrevidencia(
    usuarioSolicitante: string
  ): Observable<RetornoPossuiPrevidencia> {
    if (!environment.production)
      return this.http.get<RetornoPossuiPrevidencia>(
        this.url + this.getPossuiPrevidencia
      );

    const body = {
      id: environment.webService.id,
      configurationId: environment.webService.configurationId,
      inputData: {
        server: environment.webService.baseUrl,
        module: environment.webService.module,
        port: this.getPossuiPrevidencia,
        service: environment.webService.service,
        user: '',
        password: '',
        encryption: environment.webService.encryption,
        aUsuarioSolicitante: usuarioSolicitante,
      },
    };
    return this.http.post<RetornoPossuiPrevidencia>(this.url, body);
  }

  persisteSolicitacao(
    dados: PersistirPrevidencia
  ): Observable<RetornoPersistirPrevidencia> {
    if (!environment.production)
      return this.http.get<RetornoPersistirPrevidencia>(
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
    return this.http.post<RetornoPersistirPrevidencia>(this.url, body);
  }
}
