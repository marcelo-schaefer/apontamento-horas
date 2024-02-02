import { Dependente } from './dependente';

export class PersisteSolicitacao {
  nEmpresa: number;
  nTipoColaborador: number;
  nMatricula: number;
  nCodigoPlano: number;
  nCodigoOperadora: number;
  beneficiartios: Dependente[];
}
export class RetornoPersisteSolicitacao {
  outputData: {
    ARetorno: string;
  };
}
