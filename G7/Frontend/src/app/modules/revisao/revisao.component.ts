import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WfFormData } from 'src/app/core/service/workflow/workflow-cockpit/dist/workflow-cockpit';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { DesligamentoService } from 'src/app/services/desligamento/desligamento.service';
import { PersisiteSolicitacao } from 'src/app/services/desligamento/models/persisite-solicitacao';
import { DadosColaboradorComponent } from 'src/app/shared/components/dados-colaborador/dados-colaborador.component';
import { DadosDesligamentoComponent } from 'src/app/shared/components/dados-desligamento/dados-desligamento.component';
import { DadosSolicitanteComponent } from 'src/app/shared/components/dados-solicitante/dados-solicitante.component';
import { ObservacaoComponent } from 'src/app/shared/components/observacao/observacao.component';
import { CaminhoAprovacao } from 'src/app/shared/model/caminho-aprovacao.enum';
import { ColaboradorDesligado } from 'src/app/shared/model/colaborador-desligado';
import {
  DadoDesligamento,
  DadoDesligamentoG5,
} from 'src/app/shared/model/dado-desligamento';

@Component({
  selector: 'app-revisao',
  templateUrl: './revisao.component.html',
  styleUrls: ['./revisao.component.scss'],
})
export class RevisaoComponent implements OnInit {
  @ViewChild(DadosSolicitanteComponent, { static: true })
  dadosSolicitanteComponent: DadosSolicitanteComponent;

  @ViewChild(DadosColaboradorComponent, { static: true })
  dadosColaboradorComponent: DadosColaboradorComponent;

  @ViewChild(DadosDesligamentoComponent, { static: true })
  dadosDesligamentoComponent: DadosDesligamentoComponent;

  @ViewChild('observacaoComponentSolicitante', { static: true })
  observacaoComponentSolicitante: ObservacaoComponent;

  @ViewChild('observacaoComponentGestor', { static: true })
  observacaoComponentGestor: ObservacaoComponent;

  @ViewChild('observacaoComponentRhu', { static: true })
  observacaoComponentRhu: ObservacaoComponent;

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

  causaDesligamento: number;
  causaSelecionada: number;
  caminhoValidacao: string;

  ngOnInit(): void {
    void this.getProcessVariables();
  }

  async getProcessVariables(): Promise<void> {
    await this.wfService.requestProcessVariables().then((value) => {
      this.solicitante = JSON.parse(value.solicitante) as Colaborador;
      this.solicitacaoPorColaborador =
        this.solicitante.AEhGestor != 'S' && this.solicitante.AEhRhu != 'S';

      this.caminhoValidacao = value.caminhoValidacao;
      const dadosDesligamento = JSON.parse(
        value.dadosDesligamento
      ) as DadoDesligamento;
      this.colaboradorDesligado = JSON.parse(
        value.colaborador
      ) as ColaboradorDesligado;

      this.causaDesligamento = Number(dadosDesligamento.nCausaDemissao);
      this.causaSelecionada = this.causaDesligamento;
      this.dadosSolicitanteComponent.preencherFormulario(this.solicitante);

      this.dadosDesligamentoComponent.preencheSolicitante(this.solicitante);
      this.dadosDesligamentoComponent.preencherFormulario(dadosDesligamento);
      this.dadosDesligamentoComponent.apresentarComoValidador();

      if (!this.solicitacaoPorColaborador) {
        this.dadosColaboradorComponent.preencherFormulario(
          this.colaboradorDesligado
        );
        this.dadosColaboradorComponent.preencherSolicitante(this.solicitante);
        this.dadosColaboradorComponent.desabilitarForm();
      }

      this.observacaoComponentSolicitante.preencherDados(
        value?.observacaoSolicitante || ''
      );

      if (
        this.solicitante?.AEhRhu != 'S' &&
        ![4, 12, 14, 26].includes(this.causaDesligamento)
      ) {
        this.observacaoComponentGestor.preencherDados(
          value?.observacaoGestorImediato || ''
        );
        this.observacaoComponentGestor.desabilitar();
      }

      this.observacaoComponentRhu.preencherDados(value?.observacaoRhu || '');
      this.observacaoComponentRhu.desabilitar();
    });
  }

  async persistirSolicitacao(): Promise<void> {
    await this.desligamentoService
      .persisitirSolicitacao(this.montaCorpoEnvio())
      .toPromise()
      .then(
        (data) => {
          if (data.outputData.message || data.outputData.ARetorno != 'OK') {
            this.notification.error(
              'Atenção',
              'Erro ao persistir a solicitação, ' +
                (data.outputData.message || data.outputData.ARetorno)
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
      nEmpresa: this.dadosColaboradorComponent.value.NCodigoEmpresa,
      nTipoColaborador: this.dadosColaboradorComponent.value.NTipoColaborador,
      nMatricula: this.dadosColaboradorComponent.value.NMatricula,
    };
  }

  transportarCausaDemissao(causa: number): void {
    this.causaSelecionada = Number(causa);
    if (!this.solicitacaoPorColaborador)
      this.dadosColaboradorComponent.definirCausaDemissao(causa);
    else this.dadosSolicitanteComponent.preencherCausaDesligamento(causa);
  }

  verificaProxiamEtapa(colaborador: ColaboradorDesligado): string {
    return this.solicitante.AEhRhu == 'S'
      ? [4, 12, 14, 26].includes(this.causaSelecionada)
        ? colaborador.AColaboradorPcd == 'S'
          ? CaminhoAprovacao.BP
          : CaminhoAprovacao.FINALIZAR
        : CaminhoAprovacao.GESTOR
      : CaminhoAprovacao.RHU;
  }

  validarEnvio(): boolean {
    return (
      this.dadosDesligamentoComponent.validarForm() &&
      (!this.solicitacaoPorColaborador
        ? this.dadosColaboradorComponent.validarForm()
        : true)
    );
  }

  async submit(): Promise<WfFormData> {
    if (this.validarEnvio()) {
      if (
        this.verificaProxiamEtapa(this.colaboradorDesligado) ==
        CaminhoAprovacao.FINALIZAR
      )
        await this.persistirSolicitacao();
      return {
        formData: {
          ...this.dadosDesligamentoComponent.value,
          dadosDesligamento: JSON.stringify(
            this.dadosDesligamentoComponent.value
          ),
          observacaoSolicitante:
            this.observacaoComponentSolicitante.value.observacao,
          caminhoSolicitacao: this.verificaProxiamEtapa(
            this.colaboradorDesligado
          ),
          etapaAnterior: CaminhoAprovacao.SOLICITANTE,
        },
      };
    }
    this.wfService.abortSubmit();
  }
}
