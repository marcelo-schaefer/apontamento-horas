export class Parentesco {
  NCodigoParentesco: number;
  ADescricaoParentesco: string;
}

export class RetornoParentesco {
  outputData: {
    parentescos: Parentesco[];
    ARetorno: string;
  };
}
