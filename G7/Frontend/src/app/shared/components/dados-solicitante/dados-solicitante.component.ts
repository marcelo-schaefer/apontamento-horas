import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';

@Component({
  selector: 'app-dados-solicitante',
  templateUrl: './dados-solicitante.component.html',
  styleUrls: ['./dados-solicitante.component.scss'],
})
export class DadosSolicitanteComponent implements OnInit {
  formDadosSolicitante: FormGroup;

  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formDadosSolicitante = this.fb.group({
      solicitante: { value: '', disabled: true },
      NMatricula: { value: '', disabled: true },
      ANome: { value: '', disabled: true },
      NTipoColaborador: { value: '', disabled: true },
      empresa: { value: '', disabled: true },
      NCodigoEmpresa: { value: '', disabled: true },
      ADescricaoEmpresa: { value: '', disabled: true },
      filial: { value: '', disabled: true },
      NCodigoFilial: { value: '', disabled: true },
      ADescricaoFilial: { value: '', disabled: true },
      posto: { value: '', disabled: true },
      ACodigoPosto: { value: '', disabled: true },
      ADescricaoPosto: { value: '', disabled: true },
      centroCusto: { value: '', disabled: true },
      ACodigoCentroCusto: { value: '', disabled: true },
      ADescricaoCentroCusto: { value: '', disabled: true },
      DDataAdmissao: { value: '', disabled: true },
    });
  }

  preencherFormulario(solicitante: Colaborador): void {
    this.formDadosSolicitante.patchValue({
      ...solicitante,
      solicitante: solicitante.NMatricula + ' - ' + solicitante.ANome,
      empresa:
        solicitante.NCodigoEmpresa + ' - ' + solicitante.ADescricaoEmpresa,
      posto: solicitante.ACodigoPosto + ' - ' + solicitante.ADescricaoPosto,
      filial: solicitante.NCodigoFilial + ' - ' + solicitante.ADescricaoFilial,
      centroCusto:
        solicitante.ACodigoCentroCusto +
        ' - ' +
        solicitante.ADescricaoCentroCusto,
    });
  }

  get value(): Colaborador {
    return this.formDadosSolicitante.getRawValue() as Colaborador;
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  desabilitarForm(): void {
    this.formDadosSolicitante.disable();
  }
}
