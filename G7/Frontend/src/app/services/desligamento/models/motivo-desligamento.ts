import { Motivo } from './motivo';

export class MotivoDesligamento {
  causaDemissao: Motivo[];
  motivoDesligamento: Motivo[];
  ARetorno: string;
}

export class RetornoMotivoDesligamento {
  outputData: MotivoDesligamento;
}
