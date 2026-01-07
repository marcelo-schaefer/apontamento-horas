import { DataApontamento } from './data-apontamento';
import { Limite } from './limite';
import { Projeto } from './projeto.model';

export interface Colaborador {
  NCodigoEmpresa: string;
  ANomeEmpresa: string;
  NTipoColaborador: string;
  ADescricaoTipoColaborador: string;
  NMatricula: string;
  ANome: string;
  AValidaTotalHoras: string;
  ARetorno: string;
  datasApontamento: DataApontamento[];
  projetos: Projeto[];
  limites: Limite[];
  AEhGestor: string;
  message?: string;
}

export interface RetornoColaborador {
  outputData: Colaborador;
}

export interface BuscaColaborador {
  nCodigoEmpresa: number;
  nTipoColaborador: number;
  nMatricula: number;
}

export class RetornoBuscaColaborador {
  outputData: {
    colaboradores: Colaborador[];
    ARetorno?: string;
    message?: string;
  };

  constructor() {
    this.outputData = { colaboradores: [] };
  }
}
