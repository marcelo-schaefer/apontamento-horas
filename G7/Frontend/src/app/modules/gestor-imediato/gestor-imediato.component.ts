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
  selector: 'app-gestor-imediato',
  templateUrl: './gestor-imediato.component.html',
  styleUrls: ['./gestor-imediato.component.scss'],
})
export class GestorImediatoComponent implements OnInit {
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
  caminhoValidacao: string;

  ngOnInit(): void {
    void this.getProcessVariables();
  }

  async getProcessVariables(): Promise<void> {
    await this.wfService.requestProcessVariables().then((value) => {
      this.solicitante = JSON.parse(value.solicitante) as Colaborador;
      this.solicitacaoPorColaborador =
        this.solicitante.AEhGestor != 'S' && this.solicitante.AEhRhu != 'S';

      this.caminhoSolicitacao = value.caminhoSolicitacao;
      this.caminhoValidacao = value.caminhoValidacao;
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

      if (value.tipoDemissao == 'Por parte do colaborador')
        this.dadosDesligamentoComponent.habilitarAvisoPrevio();

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

      this.observacaoComponentGestor.preencherDados(
        value?.observacaoGestorImediato || ''
      );

      if (this.caminhoValidacao == 'bp' || this.caminhoSolicitacao == 'bp') {
        if (this.colaboradorDesligado.AEhAtacadao == 'S')
          this.observacaoComponentBp.apresentarAvisoPrevio();
        this.observacaoComponentBp.preencherDados(value?.observacaoBp || '');
        this.observacaoComponentBp.desabilitar();
      }
    });
  }

  verificaProxiamEtapa(): string {
    return this.colaboradorDesligado.AEhAtacadao == 'S' &&
      (this.dadosDesligamentoComponent.value.aLiberacaoAvisoPrevio == 'S' ||
        (this.dadosDesligamentoComponent.value.nCausaDemissao == 4 &&
          !!this.colaboradorDesligado.AEstabilidade))
      ? 'bp'
      : this.colaboradorDesligado.AEhAtacadao == 'S'
      ? 'rh'
      : 'csc';
  }

  validarEnvio(): boolean {
    return (
      this.dadosDesligamentoComponent.validarForm() &&
      this.observacaoComponentGestor.formularioValido()
    );
  }

  submit(step: WfProcessStep): WfFormData {
    if (step.nextAction.name != 'Aprovar')
      this.observacaoComponentGestor.tornarObrigatorio();
    else this.observacaoComponentGestor.tornarOpcional();

    if (this.validarEnvio()) {
      return {
        formData: {
          ...this.dadosDesligamentoComponent.value,
          dadosDesligamento: JSON.stringify(
            this.dadosDesligamentoComponent.value
          ),
          statusSolicitacao:
            step.nextAction.name == 'Aprovar'
              ? 'Aprovado'
              : step.nextAction.name == 'Reprovar'
              ? 'Reprovado'
              : 'Em andamento',
          observacaoGestorImediato:
            this.observacaoComponentGestor.value.observacao,
          caminhoValidacao:
            step.nextAction.name == 'Revisar'
              ? 'gestor'
              : this.verificaProxiamEtapa(),
        },
      };
    }
    this.wfService.abortSubmit();
  }
}
