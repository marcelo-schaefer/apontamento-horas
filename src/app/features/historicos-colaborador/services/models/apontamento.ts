export interface Apontamento {
  NCodigoProjeto: string;
  NQuantidade: string;
  quantidadeHoras: Date;
  quantidadeFormatado?: string;
  incluido?: boolean | false;
  excluido?: boolean | false;
  alterado?: boolean | false;
}
