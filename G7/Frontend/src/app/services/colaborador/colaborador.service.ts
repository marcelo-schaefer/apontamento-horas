import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  RetornoColaborador,
  RetornoColaboradores,
} from './models/colaboradores.model';
import { CodigoTexto, Search } from './models/search';

@Injectable({
  providedIn: 'root',
})
export class ColaboradorService {
  private getSolicitante = 'dadosSolicitante';
  private getColaboradores = 'retornaColaboradores';
  private url = environment.plugin.invoke;

  constructor(private http: HttpClient) {}

  criarBusca(entrada: string): CodigoTexto {
    const searchProcess: CodigoTexto = { codigo: 0, texto: '' };
    const apenasNumerosRegex = /^\d.*$/;

    if (entrada) {
      let entradaTrim = entrada.trim();

      /** Verifica se existe código(número) no inicio do texto
       *  Caso exista e separado do texto */
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (apenasNumerosRegex.test(entradaTrim)) {
        const codigoString = entradaTrim.replace(/[^\d].*$/g, '');
        /** Removendo o código(número) do texto */
        entradaTrim = entradaTrim.substring(codigoString.length).trim();
        searchProcess.codigo = +codigoString;
      }

      /** Removendo espaços e '-' do texto */
      entradaTrim = entradaTrim.replace(/^-/, '').trim();
      searchProcess.texto = entradaTrim;
    }

    return searchProcess;
  }

  buscaSolicitante(usuarioSolicitante: string): Observable<RetornoColaborador> {
    if (!environment.production)
      return this.http.get<RetornoColaborador>(this.url + this.getSolicitante);

    const body = {
      id: environment.webServices.id,
      inputData: {
        server: environment.webServices.server,
        module: 'rubi',
        port: this.getSolicitante,
        service: 'com.senior.automacao.hcm.desligamento',
        user: '',
        password: '',
        encryption: 1,
        aUsuarioSolicitante: usuarioSolicitante,
      },
    };
    return this.http.post<RetornoColaborador>(this.url, body);
  }

  buscaColaboradores(dados: Search): Observable<RetornoColaboradores> {
    if (!environment.production)
      return this.http.get<RetornoColaboradores>(
        this.url + this.getColaboradores
      );

    const body = {
      id: environment.webServices.id,
      inputData: {
        server: environment.webServices.server,
        module: 'rubi',
        port: this.getColaboradores,
        service: 'com.senior.automacao.hcm.desligamento',
        user: '',
        password: '',
        encryption: 1,
        ...dados,
      },
    };
    return this.http.post<RetornoColaboradores>(this.url, body);
  }
}
