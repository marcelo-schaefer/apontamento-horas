import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ColaboradorService } from './../../services/colaborador/colaborador.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import {
  WfFormData,
  WfProcessStep,
} from 'src/app/core/service/workflow/workflow-cockpit/dist/workflow-cockpit';
import { DadosSolicitanteComponent } from 'src/app/shared/components/dados-solicitante/dados-solicitante.component';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { ObservacaoComponent } from 'src/app/shared/components/observacao/observacao.component';
import { format } from 'date-fns';
import { Dependente } from 'src/app/shared/model/dependente';
import { TipoSolicitacaoComponent } from 'src/app/shared/components/tipo-solicitacao/tipo-solicitacao.component';
import { TermoCienciaComponent } from 'src/app/shared/components/termo-ciencia/termo-ciencia.component';
import { PrevidenciaPrivadaService } from 'src/app/services/previdencia-privada/previdencia-privada.service';
import { PersistirPrevidencia } from 'src/app/services/previdencia-privada/models/persistir-previdencia';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css'],
})
export class SolicitacaoComponent implements OnInit {
  @ViewChild(DadosSolicitanteComponent, { static: true })
  dadosSolicitanteComponent: DadosSolicitanteComponent;

  @ViewChild(TipoSolicitacaoComponent, { static: true })
  tipoSolicitacaoComponent: TipoSolicitacaoComponent;

  @ViewChild(TermoCienciaComponent, { static: true })
  termoCienciaComponent: TermoCienciaComponent;

  @ViewChild(ObservacaoComponent, { static: true })
  observacaoComponent: ObservacaoComponent;

  usernameSolicitante: string;
  solicitante: Colaborador;
  dependentes: Dependente[];

  constructor(
    private wfService: WorkflowService,
    private colaboradorService: ColaboradorService,
    private previdenciaPrivadaService: PrevidenciaPrivadaService,
    private notification: NzNotificationService
  ) {
    this.wfService.onSubmit(this.submit.bind(this));
  }

  async ngOnInit(): Promise<void> {
    this.usernameSolicitante = this.wfService.getUser().username;
    await this.buscaSolicitante();
    await this.buscaPossuiPrevidencia();
    await this.buscaDependentes();
    this.tipoSolicitacaoComponent.preencherDadosColaborador(
      this.solicitante,
      this.dependentes
    );
  }

  //Metodo que cria notificações de erro na tela
  criaNotificacao(msg: string): void {
    this.notification.create('error', 'Atenção', msg, {
      nzDuration: 6000,
    });
  }

  async buscaSolicitante(): Promise<void> {
    this.dadosSolicitanteComponent.loadingForm(true);
    this.tipoSolicitacaoComponent.loadingForm(true);

    await this.colaboradorService
      .buscaSolicitante(this.usernameSolicitante)
      .toPromise()
      .then(
        (data) => {
          this.solicitante = data.outputData;
          if (this.solicitante.ARetorno != 'OK') {
            this.criaNotificacao(
              'Erro ao identificar solicitante, ' + this.solicitante.ARetorno
            );
          } else
            this.dadosSolicitanteComponent.preencherFormulario(
              this.solicitante
            );
        },
        () => {
          this.criaNotificacao(
            'Erro ao identificar solicitante, tente mais tarde ou contate o administrador.'
          );
        }
      );
    this.dadosSolicitanteComponent.loadingForm(false);
  }

  async buscaPossuiPrevidencia(): Promise<void> {
    await this.previdenciaPrivadaService
      .buscaPossuiPrevidencia(this.usernameSolicitante)
      .toPromise()
      .then(
        (data) => {
          if (data.outputData.ARetorno != 'OK') {
            this.criaNotificacao(
              'Erro ao identificar se solicitante ja possui previdencia privada, ' +
                data.outputData.ARetorno
            );
          } else {
            this.solicitante = Object.assign(this.solicitante, data.outputData);
          }
        },
        () => {
          this.criaNotificacao(
            'Erro ao identificar solicitante ja possui previdencia privada, tente mais tarde ou contate o administrador.'
          );
        }
      );
  }

  async buscaDependentes(): Promise<void> {
    await this.colaboradorService
      .buscaDependentes(this.usernameSolicitante)
      .toPromise()
      .then(
        (data) => {
          if (data.outputData.ARetorno != 'OK') {
            this.criaNotificacao(
              'Erro ao buscar os dependentes, ' + data.outputData.ARetorno
            );
          } else this.dependentes = data.outputData.dependentes;
        },
        () => {
          this.criaNotificacao(
            'Erro ao buscar os dependentes, tente mais tarde ou contate o administrador.'
          );
        }
      );

    this.tipoSolicitacaoComponent.loadingForm(false);
  }

  async persisteSolicitacao(): Promise<void> {
    await this.previdenciaPrivadaService
      .persisteSolicitacao(this.montaCorpoPersistencia())
      .toPromise()
      .then(
        (data) => {
          if (data.outputData.ARetorno != 'OK') {
            this.criaNotificacao(
              'Erro ao persistir solicitaçãos, ' + data.outputData.ARetorno
            );
            this.wfService.abortSubmit();
          }
        },
        () => {
          this.criaNotificacao(
            'Erro ao persistir solicitaçãos, tente mais tarde ou contate o administrador.'
          );
          this.wfService.abortSubmit();
        }
      );

    this.tipoSolicitacaoComponent.loadingForm(false);
  }

  montaCorpoPersistencia(): PersistirPrevidencia {
    const dadosSolicitacao = this.tipoSolicitacaoComponent.value;
    return {
      AContribuicao: dadosSolicitacao.contribuicao,
      APorcentagemContribuicao: dadosSolicitacao.porcentagemContribuicao,
      ARegime: dadosSolicitacao.regime,
      beneficiarios: dadosSolicitacao.dependentes,
    };
  }

  validarEnvio(): boolean {
    return (
      this.tipoSolicitacaoComponent.validarForm() &&
      this.termoCienciaComponent.validarForm()
    );
  }

  async submit(step: WfProcessStep): Promise<WfFormData> {
    if (this.validarEnvio()) {
      await this.persisteSolicitacao();

      const observacaoSolicitante = this.observacaoComponent.value.observacao;
      const dadosSolicitacao = this.tipoSolicitacaoComponent.value;
      return {
        formData: {
          numeroSolicitacao: step.processInstanceId,
          dataSolicitacao: format(new Date(), 'dd/MM/yyyy'),
          tipoSolicitacao:
            this.tipoSolicitacaoComponent.retornaTipoSolicitacao(),
          opcaoContribuicao: dadosSolicitacao.contribuicaoFormatada,
          tipoRegime: dadosSolicitacao.regimeFormatado,
          contribuicao: dadosSolicitacao.porcentagemContribuicao + '%',
          solicitante: JSON.stringify(this.solicitante),
          dadosSolicitacao: JSON.stringify(dadosSolicitacao),
          observacaoSolicitante: observacaoSolicitante,
          empresaSolicitante:
            this.solicitante.NCodigoEmpresa.toString() +
            ' - ' +
            this.solicitante.ADescricaoEmpresa,
          nomeMatriculaSolicitante:
            this.solicitante.NMatricula.toString() +
            ' - ' +
            this.solicitante.ANome,
          dataAdmissaoSolicitante: this.solicitante.DDataAdmissao,
          filialSolicitante:
            this.solicitante.NCodigoFilial +
            ' - ' +
            this.solicitante.ADescricaoFilial,
          postoSolicitante:
            this.solicitante.ACodigoPosto +
            ' - ' +
            this.solicitante.ADescricaoPosto,
          centroCustoSolicitante:
            this.solicitante.ACodigoCentroCusto +
            ' - ' +
            this.solicitante.ADescricaoCentroCusto,
          beneficairios: dadosSolicitacao.dependentes
            .map((dependente) => dependente.ANome)
            .join(', '),
          statusSolicitacao: 'Aprovado',
        },
      };
    }
    this.wfService.abortSubmit();
  }
}
