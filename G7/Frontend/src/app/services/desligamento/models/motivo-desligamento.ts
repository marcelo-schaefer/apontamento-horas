import { Motivo } from './motivo';

export class MotivoDesligamento {
  causaDemissao: Motivo[];
  motivoDesligamento: Motivo[];
  ARetorno: string;
  message: string;
}

export class RetornoMotivoDesligamento {
  outputData: MotivoDesligamento;
}
