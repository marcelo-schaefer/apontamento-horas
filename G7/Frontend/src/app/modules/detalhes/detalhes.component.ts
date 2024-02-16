import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { DadosColaboradorComponent } from 'src/app/shared/components/dados-colaborador/dados-colaborador.component';
import { DadosDesligamentoComponent } from 'src/app/shared/components/dados-desligamento/dados-desligamento.component';
import { DadosSolicitanteComponent } from 'src/app/shared/components/dados-solicitante/dados-solicitante.component';
import { ObservacaoComponent } from 'src/app/shared/components/observacao/observacao.component';
import { ColaboradorDesligado } from 'src/app/shared/model/colaborador-desligado';
import { DadoDesligamento } from 'src/app/shared/model/dado-desligamento';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
})
export class DetalhesComponent implements OnInit {
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

  @ViewChild('observacaoComponentSegundaValidacao', { static: true })
  observacaoComponentSegundaValidacao: ObservacaoComponent;

  constructor(private wfService: WorkflowService) {}

  solicitante: Colaborador;
  colaboradorDesligado: ColaboradorDesligado;

  solicitacaoPorColaborador: boolean;

  tituloObservacaoPrimeiraValidacao: string;
  tituloObservacaoSegundaValidacao: string;
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

      if (this.colaboradorDesligado.AEhAtacadao == 'S') {
        this.observacaoComponentBp.apresentarAvisoPrevio();
        this.observacaoComponentBp.preencherAvisoPrevio(
          value?.aprovarAvisoPrevio
        );
      }
      this.observacaoComponentBp.preencherDados(value?.observacaoBp || '');
      this.observacaoComponentBp.desabilitar();

      if (this.caminhoValidacao == 'csc') {
        this.tituloObservacaoSegundaValidacao =
          'Observação do CSC Desligamento';
        this.observacaoComponentSegundaValidacao.preencherDados(
          value?.observacaoCsc || ''
        );
        this.observacaoComponentSegundaValidacao.desabilitar();
      } else if (this.caminhoValidacao == 'rh') {
        this.tituloObservacaoSegundaValidacao = 'Observação do RH Operações';
        this.observacaoComponentSegundaValidacao.preencherDados(
          value?.observacaoRh || ''
        );
        this.observacaoComponentSegundaValidacao.desabilitar();
      }
    });
  }
}
