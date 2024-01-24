import { Dependente } from './dependente';

export class DadosSolicitacao {
  contribuicao: string;
  contribuicaoFormatada: string;
  porcentagemContribuicao: string;
  regime: string;
  regimeFormatado: string;
  pessoaPolitica: string;
  dependentes: Dependente[];
}
