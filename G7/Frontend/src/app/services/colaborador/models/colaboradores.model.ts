export class Colaborador {
  NMatricula: number;
  ANome: string;
  NTipoColaborador: number;
  NCodigoEmpresa: number;
  ADescricaoEmpresa: string;
  NCodigoFilial: string;
  ADescricaoFilial: string;
  ACodigoPosto: string;
  ADescricaoPosto: string;
  ACodigoCentroCusto: string;
  ADescricaoCentroCusto: string;
  DDataAdmissao: string;
  AColaboradorPcd: string;
  AColaboradorPom: string;
  AEstabilidade: string;
  DDataTermino: string;
  AEhGestor: string;
  AEhRhu: string;
  AGestorImediato: string;
  APapelRhu: string;
  AEhAtacadao: string;
  ARetorno: string;
}

export class RetornoColaborador {
  outputData: Colaborador;
}
export class RetornoColaboradores {
  outputData: { colaboradores: Colaborador[]; ARetorno: string };
}
