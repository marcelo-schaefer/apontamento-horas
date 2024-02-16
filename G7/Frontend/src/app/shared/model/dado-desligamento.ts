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
      nAvisoPrevio: dados.nAvisoPrevio,
      aLiberacaoAvisoPrevio: dados.aLiberacaoAvisoPrevio,
      dDataDemissao: dados.dDataDemissao,
      dDataPagamento: dados.dDataPagamento,
      dDataAvisoPrevio: dados.dDataAvisoPrevio,
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
  liberarAvisoPrevio: string;
  tipoDemissao: string;
  avisoPrevio: string;
  motivosDesligamento: MotivoDesligamento;
  listaAvisoPrevio: Motivo[];
}
