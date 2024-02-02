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
import { DadosPlanoVidaComponent } from 'src/app/shared/components/dados-plano-vida/dados-plano-vida.component';
import { AlteracaoBeneficiariosComponent } from 'src/app/shared/components/alteracao-beneficiarios/alteracao-beneficiarios.component';
import { Parentesco } from 'src/app/services/seguro-vida/models/parentesco';
import { SeguroVidaService } from 'src/app/services/seguro-vida/seguro-vida.service';
import { PersisteSolicitacao } from 'src/app/services/seguro-vida/models/persiste-solicitacao';
import { PlanoSeguroVida } from 'src/app/services/seguro-vida/models/plano-seguro-vida';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css'],
})
export class SolicitacaoComponent implements OnInit {
  @ViewChild(DadosSolicitanteComponent, { static: true })
  dadosSolicitanteComponent: DadosSolicitanteComponent;

  @ViewChild(DadosPlanoVidaComponent, { static: true })
  dadosPlanoVidaComponent: DadosPlanoVidaComponent;

  @ViewChild(AlteracaoBeneficiariosComponent, { static: true })
  alteracaoBeneficiariosComponent: AlteracaoBeneficiariosComponent;

  usernameSolicitante: string;
  solicitante: Colaborador;
  planoSolicitante: PlanoSeguroVida;
  listaGrausParentescos: Parentesco[];

  constructor(
    private wfService: WorkflowService,
    private colaboradorService: ColaboradorService,
    private seguroVidaService: SeguroVidaService,
    private notification: NzNotificationService
  ) {
    this.wfService.onSubmit(this.submit.bind(this));
  }

  async ngOnInit(): Promise<void> {
    this.usernameSolicitante = this.wfService.getUser().username;
    await this.buscaSolicitante();
    await this.buscaPlanoSeguroVida();
    await this.buscaGrauParentescos();
    this.alteracaoBeneficiariosComponent.preencherListaParentescos(
      this.listaGrausParentescos
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

  async buscaPlanoSeguroVida(): Promise<void> {
    await this.seguroVidaService
      .buscaPlanoSeguroVida(this.usernameSolicitante)
      .toPromise()
      .then(
        (data) => {
          if (data.outputData.ARetorno != 'OK') {
            this.criaNotificacao(
              'Erro ao buscar seguro de vida do solicitante, ' +
                data.outputData.ARetorno
            );
          } else {
            this.planoSolicitante = data.outputData;
            this.dadosPlanoVidaComponent.preencherFormulario(
              this.planoSolicitante
            );
          }
        },
        () => {
          this.criaNotificacao(
            'Erro ao buscar seguro de vida do solicitante, tente mais tarde ou contate o administrador.'
          );
        }
      );
  }

  async buscaGrauParentescos(): Promise<void> {
    await this.seguroVidaService
      .buscaGrauParentescos()
      .toPromise()
      .then(
        (data) => {
          if (data.outputData.ARetorno != 'OK') {
            this.criaNotificacao(
              'Erro ao buscar graus de parentescos, ' + data.outputData.ARetorno
            );
          } else this.listaGrausParentescos = data.outputData.parentescos;
        },
        () => {
          this.criaNotificacao(
            'Erro ao buscar graus de parentescos, tente mais tarde ou contate o administrador.'
          );
        }
      );
  }

  async persistirSolicitacao(): Promise<void> {
    await this.seguroVidaService
      .persistirSolicitacao(this.montaCorpoPersistencia())
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
          // this.wfService.abortSubmit();
        }
      );
  }

  montaCorpoPersistencia(): PersisteSolicitacao {
    return {
      nEmpresa: this.solicitante.NCodigoEmpresa,
      nTipoColaborador: this.solicitante.NTipoColaborador,
      nMatricula: this.solicitante.NMatricula,
      nCodigoPlano: this.planoSolicitante.NCodigoPlano,
      nCodigoOperadora: this.planoSolicitante.NCodigoOperadora,
      beneficiartios: this.alteracaoBeneficiariosComponent.value,
    };
  }

  validarEnvio(): boolean {
    return this.alteracaoBeneficiariosComponent.validarForm();
  }

  async submit(step: WfProcessStep): Promise<WfFormData> {
    if (this.validarEnvio()) {
      await this.persistirSolicitacao();

      return {
        formData: {
          ...this.dadosSolicitanteComponent.value,
          numeroSolicitacao: step.processInstanceId,
          dataSolicitacao: format(new Date(), 'dd/MM/yyyy'),
          nomeProcesso: 'Solicitação de Alteração de Seguro de Vida',
          solicitante: JSON.stringify(this.solicitante),
          planoSolicitante: JSON.stringify(this.planoSolicitante),
          listaGrausParentescos: JSON.stringify(this.listaGrausParentescos),
          dependentes: JSON.stringify(
            this.alteracaoBeneficiariosComponent.value
          ),
        },
      };
    }
    this.wfService.abortSubmit();
  }
}
