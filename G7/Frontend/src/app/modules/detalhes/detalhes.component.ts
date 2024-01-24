import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { DadosSolicitanteComponent } from 'src/app/shared/components/dados-solicitante/dados-solicitante.component';
import { ObservacaoComponent } from 'src/app/shared/components/observacao/observacao.component';
import { TermoCienciaComponent } from 'src/app/shared/components/termo-ciencia/termo-ciencia.component';
import { TipoSolicitacaoComponent } from 'src/app/shared/components/tipo-solicitacao/tipo-solicitacao.component';
import { DadosSolicitacao } from 'src/app/shared/model/dados-solicitacao';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
})
export class DetalhesComponent implements OnInit {
  @ViewChild(DadosSolicitanteComponent, { static: true })
  dadosSolicitanteComponent: DadosSolicitanteComponent;

  @ViewChild(TipoSolicitacaoComponent, { static: true })
  tipoSolicitacaoComponent: TipoSolicitacaoComponent;

  @ViewChild(TermoCienciaComponent, { static: true })
  termoCienciaComponent: TermoCienciaComponent;

  @ViewChild(ObservacaoComponent, { static: true })
  observacaoComponent: ObservacaoComponent;

  constructor(private wfService: WorkflowService) {}

  ngOnInit(): void {
    void this.getProcessVariables();
  }

  async getProcessVariables(): Promise<void> {
    await this.wfService.requestProcessVariables().then((value) => {
      const solicitante = JSON.parse(value.solicitante) as Colaborador;

      this.dadosSolicitanteComponent.preencherFormulario(solicitante);
      this.tipoSolicitacaoComponent.preencherTipoSolicitacao(
        value.tipoSolicitacao
      );
      this.tipoSolicitacaoComponent.preencherDadosSolicitacao(
        JSON.parse(value.dadosSolicitacao) as DadosSolicitacao
      );

      this.termoCienciaComponent.setValue(true);
      this.observacaoComponent.preencherDados(value.observacaoSolicitante);

      this.tipoSolicitacaoComponent.desabilitarForm();
      this.termoCienciaComponent.desabilitarForm();
      this.observacaoComponent.desabilitar();
    });
  }
}
