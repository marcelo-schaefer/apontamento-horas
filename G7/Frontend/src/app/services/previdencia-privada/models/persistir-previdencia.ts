import { Dependente } from 'src/app/shared/model/dependente';

export class PersistirPrevidencia {
  AContribuicao: string;
  APorcentagemContribuicao: string;
  ARegime: string;
  beneficiarios: Dependente[];
}

export class RetornoPersistirPrevidencia {
  outputData: { ARetorno: string };
}
