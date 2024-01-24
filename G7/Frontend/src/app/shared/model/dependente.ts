export class Dependente {
  selecionado?: boolean;
  APossuiPrevidencia?: string;
  NId?: number;
  ANome?: string;
  DDataNascimento?: string;
  ACpf?: string;
}

export class RetornoDependentes {
  outputData: {
    dependentes: Dependente[];
    ARetorno: string;
  };
}
