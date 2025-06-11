export interface Apontamento {
  NCodigoProjeto: string;
  NQuantidade: string;
  quantidadeHoras: Date;
  AObservacao: string;
  quantidadeFormatado?: string;
  incluido?: boolean | false;
  excluido?: boolean | false;
  alterado?: boolean | false;
}
