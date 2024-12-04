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
import { format } from 'date-fns';
import { DadosColaboradorComponent } from 'src/app/shared/components/dados-colaborador/dados-colaborador.component';
import { DesligamentoService } from 'src/app/services/desligamento/desligamento.service';
import { MotivoDesligamento } from 'src/app/services/desligamento/models/motivo-desligamento';
import { DadosDesligamentoComponent } from 'src/app/shared/components/dados-desligamento/dados-desligamento.component';
import { ObservacaoComponent } from 'src/app/shared/components/observacao/observacao.component';
import { ColaboradorDesligado } from 'src/app/shared/model/colaborador-desligado';
import { Solicitante } from 'src/app/shared/model/solicitante';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css'],
})
export class SolicitacaoComponent implements OnInit {
  @ViewChild(DadosSolicitanteComponent, { static: true })
  dadosSolicitanteComponent: DadosSolicitanteComponent;

  @ViewChild(DadosColaboradorComponent, { static: true })
  dadosColaboradorComponent: DadosColaboradorComponent;

  @ViewChild(DadosDesligamentoComponent, { static: true })
  dadosDesligamentoComponent: DadosDesligamentoComponent;

  @ViewChild(ObservacaoComponent, { static: true })
  observacaoComponent: ObservacaoComponent;

  usernameSolicitante: string;
  solicitante: Colaborador;
  motivosDesligamento: MotivoDesligamento;
  solicitacaoPorColaborador = true;

  constructor(
    private wfService: WorkflowService,
    private colaboradorService: ColaboradorService,
    private desligamentoService: DesligamentoService,
    private notification: NzNotificationService
  ) {
    this.wfService.onSubmit(this.submit.bind(this));
  }

  async ngOnInit(): Promise<void> {
    this.usernameSolicitante = this.wfService.getUser().username;
    this.loadingForm(true);
    await this.buscaSolicitante();
    await this.buscaMotivosDesligamento();
    this.preencherFormularios();
    this.loadingForm(false);
  }

  preencherFormularios(): void {
    this.solicitacaoPorColaborador =
      this.solicitante.AEhGestor != 'S' && this.solicitante.AEhRhu != 'S';
    this.dadosColaboradorComponent.preencherSolicitante(this.solicitante);
    this.dadosColaboradorComponent.opcoesIniciais();

    this.dadosDesligamentoComponent.preencheSolicitante(this.solicitante);
    this.dadosDesligamentoComponent.preencheMotivosDesligamento(
      this.motivosDesligamento
    );
  }

  loadingForm(loading: boolean): void {
    this.dadosSolicitanteComponent.loadingForm(loading);
    this.dadosColaboradorComponent.loadingForm(loading);
    this.dadosDesligamentoComponent.loadingForm(loading);
  }

  //Metodo que cria notificações de erro na tela
  criaNotificacao(msg: string): void {
    this.notification.create('error', 'Atenção', msg, {
      nzDuration: 6000,
    });
  }

  async buscaSolicitante(): Promise<void> {
    await this.colaboradorService
      .buscaSolicitante(this.usernameSolicitante)
      .toPromise()
      .then(
        (data) => {
          this.solicitante = data.outputData;
          this.solicitante.DDataTermino = '25/12/2024';
          if (this.solicitante.ARetorno != 'OK' || this.solicitante?.message) {
            this.criaNotificacao(
              'Erro ao identificar solicitante, ' +
                (this.solicitante?.message || this.solicitante.ARetorno)
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
  }

  async buscaMotivosDesligamento(): Promise<void> {
    await this.desligamentoService
      .buscaMotivosDesliagmento()
      .toPromise()
      .then(
        (data) => {
          if (data.outputData.ARetorno != 'OK' || data.outputData.message) {
            this.criaNotificacao(
              'Erro ao buscar motivos do desligamento, ' +
                (data.outputData.message || data.outputData.ARetorno)
            );
          } else this.motivosDesligamento = data.outputData;
        },
        () => {
          this.criaNotificacao(
            'Erro ao buscar motivos do desligamento, tente mais tarde ou contate o administrador.'
          );
        }
      );
  }

  transportarCausaDemissao(causa: number): void {
    if (!this.solicitacaoPorColaborador)
      this.dadosColaboradorComponent.definirCausaDemissao(causa);
    else this.dadosSolicitanteComponent.preencherCausaDesligamento(causa);
  }

  colaboradorSelecionado(colaborador: Colaborador): void {
    if (colaborador)
      this.dadosDesligamentoComponent.preencheColaboradorSelecionado(
        colaborador
      );
  }

  converteSolicitanteParaColaboradorDesligado(
    solicitante: Solicitante
  ): ColaboradorDesligado {
    return {
      ...solicitante,
      matriculaColaborador: solicitante.matriculaSolicitante,
      nomeColaborador: solicitante.nomeSolicitante,
      postoColaborador: solicitante.postoSolicitante,
      centroCustoColaborador: solicitante.centroCustoSolicitante,
      dataAdmissaoColaborador: solicitante.DDataAdmissao,
      colaboradorDesligadoPcd:
        solicitante.AColaboradorPcd == 'S' ? 'Sim' : 'Não',
      colaboradorDesligadoPom:
        solicitante.AColaboradorPom == 'S' ? 'Sim' : 'Não',
    };
  }

  verificaProxiamEtapa(colaborador: ColaboradorDesligado): string {
    return this.solicitacaoPorColaborador ||
      (this.solicitante.AEhRhu == 'S' && this.solicitante.AEhGestor == 'N')
      ? 'gestor'
      : this.solicitante.AEhGestor == 'S' &&
        this.solicitante.AEhRhu == 'S' &&
        this.dadosDesligamentoComponent.value.aLiberacaoAvisoPrevio == 'S' &&
        colaborador.AEhAtacadao == 'S' && // Colaborador for do Atacadão
        Number(this.dadosDesligamentoComponent.value.nCausaDemissao) == 2 && // sem justa causa
        colaborador.ATemEstabilidade == 'S' // sem justa causa
      ? 'bp'
      : this.solicitante.AEhGestor == 'S' &&
        this.solicitante.AEhRhu == 'S' &&
        colaborador.AEhAtacadao == 'S'
      ? 'rh'
      : this.solicitante.AEhGestor == 'S' && this.solicitante.AEhRhu == 'S'
      ? 'csc'
      : 'rhu';
  }

  validarEnvio(): boolean {
    return (
      this.dadosDesligamentoComponent.validarForm() &&
      (!this.solicitacaoPorColaborador
        ? this.dadosColaboradorComponent.validarForm()
        : true)
    );
  }

  submit(step: WfProcessStep): WfFormData {
    if (this.validarEnvio()) {
      const colaboradorDesligado = this.solicitacaoPorColaborador
        ? this.converteSolicitanteParaColaboradorDesligado(
            this.dadosSolicitanteComponent.value
          )
        : this.dadosColaboradorComponent.value;
      return {
        formData: {
          ...this.dadosSolicitanteComponent.value,
          ...this.dadosDesligamentoComponent.value,
          ...colaboradorDesligado,
          numeroSolicitacao: step.processInstanceId,
          dataSolicitacao: format(new Date(), 'dd/MM/yyyy'),
          nomeProcesso: 'Solicitação de Desligamento',
          solicitante: JSON.stringify(this.solicitante),
          dadosDesligamento: JSON.stringify(
            this.dadosDesligamentoComponent.value
          ),
          colaborador: JSON.stringify(colaboradorDesligado),
          tipoDemissao: this.solicitacaoPorColaborador
            ? 'Por parte do colaborador'
            : 'Por parte da empresa',
          observacaoSolicitante: this.observacaoComponent.value.observacao,
          caminhoSolicitacao: this.verificaProxiamEtapa(colaboradorDesligado),
          usuarioGestorImediato: colaboradorDesligado.AGestorImediato,
          papelRhu: colaboradorDesligado.APapelRhu,
          papelBp: colaboradorDesligado.APapelBp,
          statusSolicitacao: 'Em andamento',
        },
      };
    }
    this.wfService.abortSubmit();
  }
}
