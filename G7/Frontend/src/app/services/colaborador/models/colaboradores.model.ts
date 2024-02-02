export class Colaborador {
  NMatricula: number;
  ANome: string;
  NTipoColaborador: number;
  empresa: string;
  NCodigoEmpresa: number;
  ADescricaoEmpresa: string;
  filial: string;
  NCodigoFilial: string;
  ADescricaoFilial: string;
  posto: string;
  ACodigoPosto: string;
  ADescricaoPosto: string;
  ACpf: string;
  ARetorno: string;
}

export class RetornoColaborador {
  outputData: Colaborador;
}
