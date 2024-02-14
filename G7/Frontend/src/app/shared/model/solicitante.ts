import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';

export class Solicitante extends Colaborador {
  matriculaSolicitante: string;
  nomeSolicitante: string;
  empresaSolicitante: string;
  filialSolicitante: string;
  postoSolicitante: string;
  centroCustoSolicitante: string;
  solicitantePcd: string;
}
