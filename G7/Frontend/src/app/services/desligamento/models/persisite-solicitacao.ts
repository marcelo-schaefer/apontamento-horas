import { DadoDesligamentoG5 } from 'src/app/shared/model/dado-desligamento';

export class PersisiteSolicitacao extends DadoDesligamentoG5 {
  nEmpresa: number;
  nTipoColaborador: number;
  nMatricula: number;
}

export class RetornoPersisiteSolicitacao {
  outputData: { ARetorno: string; message: string };
}
