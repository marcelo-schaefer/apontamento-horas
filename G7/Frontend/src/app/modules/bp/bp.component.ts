import { Component, OnInit, ViewChild } from '@angular/core';
import {
  WfFormData,
  WfProcessStep,
} from 'src/app/core/service/workflow/workflow-cockpit/dist/workflow-cockpit';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { DadosColaboradorComponent } from 'src/app/shared/components/dados-colaborador/dados-colaborador.component';
import { DadosDesligamentoComponent } from 'src/app/shared/components/dados-desligamento/dados-desligamento.component';
import { DadosSolicitanteComponent } from 'src/app/shared/components/dados-solicitante/dados-solicitante.component';
import { ObservacaoComponent } from 'src/app/shared/components/observacao/observacao.component';
import { ColaboradorDesligado } from 'src/app/shared/model/colaborador-desligado';
import { DadoDesligamento } from 'src/app/shared/model/dado-desligamento';

@Component({
  selector: 'app-bp',
  templateUrl: './bp.component.html',
  styleUrls: ['./bp.component.scss'],
})
export class BpComponent implements OnInit {
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

  constructor(private wfService: WorkflowService) {
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
      this.dadosDesligamentoComponent.desabilitarForm();

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
      } else if (this.caminhoSolicitacao == 'rhu') {
        this.tituloObservacaoPrimeiraValidacao = 'Observação do RHU';
        this.observacaoComponentPrimeiraValidacao.preencherDados(
          value?.observacaoRhu || ''
        );
      }

      if (this.colaboradorDesligado.AEhAtacadao == 'S')
        this.observacaoComponentBp.apresentarAvisoPrevio();
      this.observacaoComponentBp.preencherDados(value?.observacaoBp || '');
    });
  }

  verificaProxiamEtapa(): string {
    return this.caminhoSolicitacao == 'gestor' &&
      this.colaboradorDesligado.AEhAtacadao == 'S' &&
      this.dadosDesligamentoComponent.value.aLiberacaoAvisoPrevio == 'S'
      ? 'gestor'
      : this.colaboradorDesligado.AEhAtacadao == 'S'
      ? 'rh'
      : 'csc';
  }

  validarEnvio(): boolean {
    return this.observacaoComponentBp.formularioValido();
  }

  submit(step: WfProcessStep): WfFormData {
    if (step.nextAction.name == 'Reprovar')
      this.observacaoComponentBp.tornarObrigatorio();
    else this.observacaoComponentBp.tornarOpcional();

    if (this.validarEnvio()) {
      return {
        formData: {
          statusSolicitacao:
            step.nextAction.name == 'Reprovar' ? 'Reprovado' : 'Em andamento',
          observacaoBp: this.observacaoComponentBp.value.observacao,
          aprovarAvisoPrevio: this.observacaoComponentBp.valueAvisoPrevio,
          caminhoValidacao: this.verificaProxiamEtapa(),
        },
      };
    }
    this.wfService.abortSubmit();
  }
}
