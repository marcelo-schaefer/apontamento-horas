import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RetornoColaborador } from './models/colaboradores.model';
import { RetornoDependentes } from 'src/app/shared/model/dependente';

@Injectable({
  providedIn: 'root',
})
export class ColaboradorService {
  private getSolicitante = 'dadosSolicitante';
  private getDependentes = 'retornaDependetes';
  private url = environment.plugin.invoke;

  constructor(private http: HttpClient) {}

  buscaSolicitante(usuarioSolicitante: string): Observable<RetornoColaborador> {
    if (!environment.production)
      return this.http.get<RetornoColaborador>(this.url + this.getSolicitante);

    const body = {
      id: environment.webService.id,
      configurationId: environment.webService.configurationId,
      inputData: {
        server: environment.webService.baseUrl,
        module: environment.webService.module,
        port: this.getSolicitante,
        service: environment.webService.service,
        user: '',
        password: '',
        encryption: environment.webService.encryption,
        aUsuarioSolicitante: usuarioSolicitante,
      },
    };
    return this.http.post<RetornoColaborador>(this.url, body);
  }

  buscaDependentes(usuarioSolicitante: string): Observable<RetornoDependentes> {
    if (!environment.production)
      return this.http.get<RetornoDependentes>(this.url + this.getDependentes);

    const body = {
      id: environment.webService.id,
      configurationId: environment.webService.configurationId,
      inputData: {
        server: environment.webService.baseUrl,
        module: environment.webService.module,
        port: this.getDependentes,
        service: environment.webService.service,
        user: '',
        password: '',
        encryption: environment.webService.encryption,
        aUsuarioSolicitante: usuarioSolicitante,
      },
    };
    return this.http.post<RetornoDependentes>(this.url, body);
  }
}
