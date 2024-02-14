import { Motivo } from 'src/app/services/desligamento/models/motivo';
import { MotivoDesligamento } from 'src/app/services/desligamento/models/motivo-desligamento';
import { DocumentModel } from 'src/app/services/document/models/document.model';

export class DadoDesligamento {
  nCausaDemissao: number;
  nMotivoDesligamento: number;
  dataDemissao: Date;
  dataPagamento: Date;
  nAvisoPrevio: number;
  dataAvisoPrevio: Date;
  aLiberacaoAvisoPrevio: string;
  anexoDocumento: DocumentModel;
  dDataDemissao: string;
  dDataPagamento: string;
  dDataAvisoPrevio: string;
  causaDemissao: string;
  motivoDesligamento: string;
  liberarAvisoPrevio: string;
  tipoDemissao: string;
  avisoPrevio: string;
  motivosDesligamento: MotivoDesligamento;
  listaAvisoPrevio: Motivo[];
}
