import { PossuiPrevidencia } from '../../previdencia-privada/models/possui-previdencia';

export class Colaborador extends PossuiPrevidencia {
  NMatricula: string;
  ANome: string;
  NTipoColaborador: string;
  empresa: string;
  NCodigoEmpresa: string;
  ADescricaoEmpresa: string;
  filial: string;
  NCodigoFilial: string;
  ADescricaoFilial: string;
  posto: string;
  ACodigoPosto: string;
  ADescricaoPosto: string;
  centroCusto: string;
  ACodigoCentroCusto: string;
  ADescricaoCentroCusto: string;
  DDataAdmissao: string;
  ARetorno: string;
}

export class RetornoColaborador {
  outputData: Colaborador;
}
