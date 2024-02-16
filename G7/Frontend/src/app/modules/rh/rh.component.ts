import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  WfFormData,
  WfProcessStep,
} from 'src/app/core/service/workflow/workflow-cockpit/dist/workflow-cockpit';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { DesligamentoService } from 'src/app/services/desligamento/desligamento.service';
import { PersisiteSolicitacao } from 'src/app/services/desligamento/models/persisite-solicitacao';
import { DadosColaboradorComponent } from 'src/app/shared/components/dados-colaborador/dados-colaborador.component';
import { DadosDesligamentoComponent } from 'src/app/shared/components/dados-desligamento/dados-desligamento.component';
import { DadosSolicitanteComponent } from 'src/app/shared/components/dados-solicitante/dados-solicitante.component';
import { ObservacaoComponent } from 'src/app/shared/components/observacao/observacao.component';
import { ColaboradorDesligado } from 'src/app/shared/model/colaborador-desligado';
import {
  DadoDesligamento,
  DadoDesligamentoG5,
} from 'src/app/shared/model/dado-desligamento';

@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.scss'],
})
export class RhComponent implements OnInit {
  @ViewChild(DadosSolicitanteComponent, { static: true })
  dadosSolicitanteComponent: DadosSolicitanteComponent;

  @ViewChild(DadosColaboradorComponent, { static: true })
  dadosColaboradorComponent: DadosColaboradorComponent;

  @ViewChild(DadosDesligamentoComponent, { static: true })
  dadosDesligamentoComponent: DadosDesligamentoComponent;

  @ViewChild('observacaoComponentSolicitante', { static: true })
  observacaoComponentSolicitante: ObservacaoComponent;

  @ViewChild('observacaoComponentPrimeiraValidacao', { static: true })
  observacaoComponentPrimeiraValidacao: ObservacaoComponent;

  @ViewChild('observacaoComponentBp', { static: true })
  observacaoComponentBp: ObservacaoComponent;

  @ViewChild('observacaoComponentRh', { static: true })
  observacaoComponentRh: ObservacaoComponent;

  constructor(
    private wfService: WorkflowService,
    private desligamentoService: DesligamentoService,
    private notification: NzNotificationService
  ) {
    this.wfService.onSubmit(this.submit.bind(this));
  }

  solicitante: Colaborador;
  colaboradorDesligado: ColaboradorDesligado;
  solicitacaoPorColaborador: boolean;
  tituloObservacaoPrimeiraValidacao: string;
  caminhoSolicitacao: string;

  ngOnInit(): void {
    void this.getProcessVariables();
  }

  async getProcessVariables(): Promise<void> {
    await this.wfService.requestProcessVariables().then((value) => {
      this.solicitante = JSON.parse(value.solicitante) as Colaborador;
      this.solicitacaoPorColaborador =
        this.solicitante.AEhGestor != 'S' && this.solicitante.AEhRhu != 'S';

      this.caminhoSolicitacao = value.caminhoSolicitacao;
      const dadosDesligamento = JSON.parse(
        value.dadosDesligamento
      ) as DadoDesligamento;
      this.colaboradorDesligado = JSON.parse(
        value.colaborador
      ) as ColaboradorDesligado;

      this.dadosSolicitanteComponent.preencherFormulario(this.solicitante);

      this.dadosDesligamentoComponent.preencheSolicitante(this.solicitante);
      this.dadosDesligamentoComponent.preencherFormulario(dadosDesligamento);
      this.dadosDesligamentoComponent.apresentarComoValidador();
      this.dadosDesligamentoComponent.habilitarParaValidacoes();

      if (!this.solicitacaoPorColaborador) {
        this.dadosColaboradorComponent.preencherFormulario(
          this.colaboradorDesligado
        );
        this.dadosColaboradorComponent.desabilitarForm();
      }

      this.observacaoComponentSolicitante.preencherDados(
        value?.observacaoSolicitante || ''
      );
      this.observacaoComponentSolicitante.desabilitar();

      if (this.caminhoSolicitacao == 'gestor') {
        this.tituloObservacaoPrimeiraValidacao =
          'Observação do Gestor Imediato';
        this.observacaoComponentPrimeiraValidacao.preencherDados(
          value?.observacaoGestorImediato || ''
        );
        this.observacaoComponentPrimeiraValidacao.desabilitar();
      } else if (this.caminhoSolicitacao == 'rhu') {
        this.tituloObservacaoPrimeiraValidacao = 'Observação do RHU';
        this.observacaoComponentPrimeiraValidacao.preencherDados(
          value?.observacaoRhu || ''
        );
        this.observacaoComponentPrimeiraValidacao.desabilitar();
      }

      if (
        this.caminhoSolicitacao == 'gestor' ||
        this.caminhoSolicitacao == 'bp'
      ) {
        if (this.colaboradorDesligado.AEhAtacadao == 'S') {
          this.observacaoComponentBp.apresentarAvisoPrevio();
          this.observacaoComponentBp.preencherAvisoPrevio(
            value?.aprovarAvisoPrevio
          );
        }
        this.observacaoComponentBp.preencherDados(value?.observacaoBp || '');
        this.observacaoComponentBp.desabilitar();
      }

      this.observacaoComponentRh.preencherDados(value?.observacaoRh || '');
    });
  }

  transportarCausaDemissao(causa: number): void {
    if (!this.solicitacaoPorColaborador)
      this.dadosColaboradorComponent.definirCausaDemissao(causa);
  }

  async buscaMotivosDesligamento(): Promise<void> {
    await this.desligamentoService
      .persisitirSolicitacao(this.montaCorpoEnvio())
      .toPromise()
      .then(
        (data) => {
          if (data.outputData.ARetorno != 'OK') {
            this.notification.error(
              'Atenção',
              'Erro ao persistir a solicitação, ' + data.outputData.ARetorno
            );
            this.wfService.abortSubmit();
          }
        },
        () => {
          this.notification.error(
            'Atenção',
            'Erro ao persistir a solicitação, tente mais tarde ou contate o administrador.'
          );
          this.wfService.abortSubmit();
        }
      );
  }

  montaCorpoEnvio(): PersisiteSolicitacao {
    return {
      ...new DadoDesligamentoG5(this.dadosDesligamentoComponent.value),
      nEmpresa: this.colaboradorDesligado.NCodigoEmpresa,
      nTipoColaborador: this.colaboradorDesligado.NTipoColaborador,
      nMatricula: this.colaboradorDesligado.NMatricula,
    };
  }

  validarEnvio(): boolean {
    return (
      this.dadosDesligamentoComponent.validarForm() &&
      this.observacaoComponentBp.formularioValido()
    );
  }

  async submit(step: WfProcessStep): Promise<WfFormData> {
    if (step.nextAction.name != 'Aprovar')
      this.observacaoComponentRh.tornarObrigatorio();
    else this.observacaoComponentRh.tornarOpcional();

    if (this.validarEnvio()) {
      if (step.nextAction.name == 'Aprovar')
        await this.buscaMotivosDesligamento();

      return {
        formData: {
          ...this.dadosDesligamentoComponent.value,
          dadosDesligamento: JSON.stringify(
            this.dadosDesligamentoComponent.value
          ),
          observacaoRh: this.observacaoComponentRh.value.observacao,
          statusSolicitacao:
            step.nextAction.name == 'Aprovar'
              ? 'Aprovado'
              : step.nextAction.name == 'Reprovar'
              ? 'Reprovado'
              : 'Em andamento',
        },
      };
    }
    this.wfService.abortSubmit();
  }
}
