import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { Solicitante } from '../../model/solicitante';

@Component({
  selector: 'app-dados-solicitante',
  templateUrl: './dados-solicitante.component.html',
  styleUrls: ['./dados-solicitante.component.scss'],
})
export class DadosSolicitanteComponent implements OnInit {
  formDadosSolicitante: FormGroup;
  solicitante: Colaborador;

  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formDadosSolicitante = this.fb.group({
      solicitante: { value: '', disabled: true },
      matriculaSolicitante: { value: '', disabled: true },
      nomeSolicitante: { value: '', disabled: true },
      empresaSolicitante: { value: '', disabled: true },
      filialSolicitante: { value: '', disabled: true },
      postoSolicitante: { value: '', disabled: true },
      centroCustoSolicitante: { value: '', disabled: true },
      solicitantePcd: { value: '', disabled: true },
      NMatricula: { value: '', disabled: true },
      ANome: { value: '', disabled: true },
      NTipoColaborador: { value: '', disabled: true },
      NCodigoEmpresa: { value: '', disabled: true },
      ADescricaoEmpresa: { value: '', disabled: true },
      NCodigoFilial: { value: '', disabled: true },
      ADescricaoFilial: { value: '', disabled: true },
      ACodigoPosto: { value: '', disabled: true },
      ADescricaoPosto: { value: '', disabled: true },
      ACodigoCenrtoCusto: { value: '', disabled: true },
      ADescricaoCenrtoCusto: { value: '', disabled: true },
      DDataAdmissao: { value: '', disabled: true },
      AColaboradorPcd: { value: '', disabled: true },
      AColaboradorPom: { value: '', disabled: true },
      AEstabilidade: { value: '', disabled: true },
      DDataTermino: { value: '', disabled: true },
      AEhGestor: { value: '', disabled: true },
      AEhRhu: { value: '', disabled: true },
      AGestorImediato: { value: '', disabled: true },
      APapelRhu: { value: '', disabled: true },
      AEhAtacadao: { value: '', disabled: true },
      ATemEstabilidade: { value: '', disabled: true },
    });
  }

  preencherFormulario(solicitante: Colaborador): void {
    this.solicitante = solicitante;
    this.formDadosSolicitante.patchValue({
      ...solicitante,
      matriculaSolicitante: solicitante.NMatricula,
      nomeSolicitante: solicitante.ANome,
      solicitante:
        solicitante.NMatricula.toString() + ' - ' + solicitante.ANome,
      empresaSolicitante:
        solicitante.NCodigoEmpresa.toString() +
        ' - ' +
        solicitante.ADescricaoEmpresa,
      filialSolicitante:
        solicitante.NCodigoFilial + ' - ' + solicitante.ADescricaoFilial,
      postoSolicitante:
        solicitante.ACodigoPosto + ' - ' + solicitante.ADescricaoPosto,
      centroCustoSolicitante:
        solicitante.ACodigoCentroCusto +
        ' - ' +
        solicitante.ADescricaoCentroCusto,
      solicitantePcd: solicitante.AColaboradorPcd == 'S' ? 'Sim' : 'Não',
    });
  }

  get value(): Solicitante {
    return this.formDadosSolicitante.getRawValue() as Solicitante;
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  desabilitarForm(): void {
    this.formDadosSolicitante.disable();
  }
}
