export class Colaborador {
  NMatricula: number;
  ANome: string;
  NTipoColaborador: number;
  NCodigoEmpresa: number;
  ADescricaoEmpresa: string;
  NCodigoFilial: string;
  ADescricaoFilial: string;
  ACodigoCargo: string;
  ADescricaoCargo: string;
  ACodigoPosto: string;
  ADescricaoPosto: string;
  ACodigoCentroCusto: string;
  ADescricaoCentroCusto: string;
  DDataAdmissao: string;
  AColaboradorPcd: string;
  AColaboradorPom: string;
  AEstabilidade: string;
  NCodVinculo: string;
  DDataTermino: string;
  AEhGestor: string;
  AEhRhu: string;
  AGestorImediato: string;
  APapelRhu: string;
  AEhAtacadao: string;
  ATemEstabilidade: string;
  APapelBp: string;
  DDataInicioBase: string;
  DDataFimBase: string;
  NDiasAcrescidos: string;
  AUsuarioGestorRegional: string;
  AForaLimiteDesligamento: string;
  ARetorno: string;
  message: string;
}

export class RetornoColaborador {
  outputData: Colaborador;
}
export class RetornoColaboradores {
  outputData: { colaboradores: Colaborador[]; ARetorno: string };
}
