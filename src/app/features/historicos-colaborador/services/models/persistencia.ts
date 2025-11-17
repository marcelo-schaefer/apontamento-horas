export interface Persistencia {
  nEmpresa: number;
  nTipoColaborador: number;
  nMatricula: number;
  dData: string;
  apontamentos: ApontamentosPersistencia[];
}

export interface ApontamentosPersistencia {
  nCodigoProjeto: number;
  nQuantidade: number;
  aTipo: string;
  aObservacao: string;
  nPorcentagemAtingida?: number;
  aDescricaoProjeto?: string;
}

export interface HorasAdicionaisPersistencia {
  nEmpresa: number;
  nTipoColaborador: number;
  nMatricula: number;
  nCodigoProjeto: number;
  nQuantidade: number;
}
