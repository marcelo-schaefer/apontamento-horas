import { DataApontamento } from "./data-apontamento";
import { Projeto } from "./projeto.model";

export interface Colaborador {
    NCodigoEmpresa: string;
    ANomeEmpresa: string;
    NTipoColaborador: string;
    ADescricaoTipoColaborador: string;
    NMatricula: string;
    ANome: string;
    ARetorno: string;
    datasApontamento: DataApontamento[];
    projetos: Projeto[];
    message: string;
}

export interface RetornoColaborador {
  outputData: Colaborador;
}
