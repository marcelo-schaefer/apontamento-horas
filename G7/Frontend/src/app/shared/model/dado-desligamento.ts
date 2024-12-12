import { Motivo } from 'src/app/services/desligamento/models/motivo';
import { MotivoDesligamento } from 'src/app/services/desligamento/models/motivo-desligamento';
import { DocumentModel } from 'src/app/services/document/models/document.model';

export class DadoDesligamentoG5 {
  nCausaDemissao: number;
  nMotivoDesligamento: number;
  nAvisoPrevio: number;
  aLiberacaoAvisoPrevio: string;
  dDataDemissao: string;
  dDataPagamento: string;
  dDataAvisoPrevio: string;

  constructor(dados: DadoDesligamentoG5) {
    return {
      nCausaDemissao: dados.nCausaDemissao,
      nMotivoDesligamento: dados.nMotivoDesligamento,
      dDataDemissao: dados.dDataDemissao,
      dDataPagamento: dados.dDataPagamento,
      nAvisoPrevio: dados.nAvisoPrevio,
      dDataAvisoPrevio: dados.dDataAvisoPrevio,
      aLiberacaoAvisoPrevio: dados.aLiberacaoAvisoPrevio,
    };
  }
}

export class DadoDesligamento extends DadoDesligamentoG5 {
  dataDemissao: Date;
  dataPagamento: Date;
  dataAvisoPrevio: Date;
  anexoDocumento: DocumentModel;
  causaDemissao: string;
  motivoDesligamento: string;
  validacaoJuridico: string;
  tipoDemissao: string;
  avisoPrevio: string;
  dataDemissaoRelatorio: string;
  motivosDesligamento: MotivoDesligamento;
  listaAvisoPrevio: Motivo[];
}
