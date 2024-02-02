import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { Dependente } from 'src/app/services/seguro-vida/models/dependente';
import { Parentesco } from 'src/app/services/seguro-vida/models/parentesco';
import { PlanoSeguroVida } from 'src/app/services/seguro-vida/models/plano-seguro-vida';
import { AlteracaoBeneficiariosComponent } from 'src/app/shared/components/alteracao-beneficiarios/alteracao-beneficiarios.component';
import { DadosPlanoVidaComponent } from 'src/app/shared/components/dados-plano-vida/dados-plano-vida.component';
import { DadosSolicitanteComponent } from 'src/app/shared/components/dados-solicitante/dados-solicitante.component';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
})
export class DetalhesComponent implements OnInit {
  @ViewChild(DadosSolicitanteComponent, { static: true })
  dadosSolicitanteComponent: DadosSolicitanteComponent;

  @ViewChild(DadosPlanoVidaComponent, { static: true })
  dadosPlanoVidaComponent: DadosPlanoVidaComponent;

  @ViewChild(AlteracaoBeneficiariosComponent, { static: true })
  alteracaoBeneficiariosComponent: AlteracaoBeneficiariosComponent;

  constructor(private wfService: WorkflowService) {}

  ngOnInit(): void {
    void this.getProcessVariables();
  }

  async getProcessVariables(): Promise<void> {
    await this.wfService.requestProcessVariables().then((value) => {
      const solicitante = JSON.parse(value.solicitante) as Colaborador;
      const planoSolicitante = JSON.parse(
        value.planoSolicitante
      ) as PlanoSeguroVida;
      const listaGrausParentescos = JSON.parse(
        value.listaGrausParentescos
      ) as Parentesco[];
      const dependentes = JSON.parse(value.dependentes) as Dependente[];

      this.dadosSolicitanteComponent.preencherFormulario(solicitante);
      this.dadosPlanoVidaComponent.preencherFormulario(planoSolicitante);
      this.alteracaoBeneficiariosComponent.preencherListaParentescos(
        listaGrausParentescos
      );
      this.alteracaoBeneficiariosComponent.preencherDependentes(dependentes);

      this.alteracaoBeneficiariosComponent.desabilitarForm();
    });
  }
}
