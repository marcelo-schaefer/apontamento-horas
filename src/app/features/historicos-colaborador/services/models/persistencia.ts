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
}

