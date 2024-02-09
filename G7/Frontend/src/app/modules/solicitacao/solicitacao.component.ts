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
    await this.buscaSolicitante();
    await this.buscaMotivosDesligamento();
    this.preencherFormularios();
  }

  preencherFormularios(): void {
    this.dadosColaboradorComponent.preencherSolicitante(this.solicitante);
    this.dadosColaboradorComponent.opcoesIniciais();

    this.dadosDesligamentoComponent.preencheSolicitante(this.solicitante);
    this.dadosDesligamentoComponent.preencheMotivosDesligamento(
      this.motivosDesligamento
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

  async buscaMotivosDesligamento(): Promise<void> {
    await this.desligamentoService
      .buscaMotivosDesliagmento()
      .toPromise()
      .then(
        (data) => {
          if (this.solicitante.ARetorno != 'OK') {
            this.criaNotificacao(
              'Erro ao buscar motivos do desligamento, ' +
                data.outputData.ARetorno
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

  validarEnvio(): boolean {
    return true;
  }

  submit(step: WfProcessStep): WfFormData {
    if (this.validarEnvio()) {
      return {
        formData: {
          ...this.dadosSolicitanteComponent.value,
          numeroSolicitacao: step.processInstanceId,
          dataSolicitacao: format(new Date(), 'dd/MM/yyyy'),
          nomeProcesso: 'Solicitação de Alteração de Seguro de Vida',
          solicitante: JSON.stringify(this.solicitante),
        },
      };
    }
    this.wfService.abortSubmit();
  }
}
