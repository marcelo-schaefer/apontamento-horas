import { Parentesco } from 'src/app/services/seguro-vida/models/parentesco';

export class Dependente {
  aNome: string;
  parentesco: Parentesco;
  nCodigoParentesco?: number;
  dataNascimento: Date;
  aDataNascimento?: string;
  nDistribuicao: number;
}
