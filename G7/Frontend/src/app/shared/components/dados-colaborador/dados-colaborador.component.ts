import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { BuscaColaboradoresComponent } from '../busca-colaboradores/busca-colaboradores.component';

@Component({
  selector: 'app-dados-colaborador',
  templateUrl: './dados-colaborador.component.html',
  styleUrls: ['./dados-colaborador.component.scss'],
})
export class DadosColaboradorComponent implements OnInit {
  @ViewChild(BuscaColaboradoresComponent, { static: true })
  buscaColaboradoresComponent: BuscaColaboradoresComponent;

  formDadosColaborador: FormGroup;

  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formDadosColaborador = this.fb.group({
      colaboradorSelecionado: { value: '', disabled: true },
      postoColaboradorSelecionado: { value: '', disabled: true },
      centroCustoColaboradorSelecionado: { value: '', disabled: true },
      dataAdmissaoColaboradorSelecionado: { value: '', disabled: true },
      colaboradorSelecionadoPcd: { value: '', disabled: true },
      colaboradorSelecionadoPom: { value: '', disabled: true },
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
    });
  }

  preencherColaboradorSelecionado(colaborador: Colaborador): void {
    this.formDadosColaborador.patchValue({
      ...colaborador,
      colaboradorSelecionado:
        colaborador.NMatricula.toString() + ' - ' + colaborador.ANome,
      postoColaboradorSelecionado:
        colaborador.ACodigoPosto + ' - ' + colaborador.ADescricaoPosto,
      centroCustoColaboradorSelecionado:
        colaborador.ACodigoCenrtoCusto +
        ' - ' +
        colaborador.ADescricaoCenrtoCusto,
      dataAdmissaoColaboradorSelecionado: colaborador.DDataAdmissao,
      colaboradorSelecionadoPcd:
        colaborador.AColaboradorPcd == 'S' ? 'Sim' : 'Não',
      colaboradorSelecionadoPom:
        colaborador.AColaboradorPom == 'S' ? 'Sim' : 'Não',
    });
  }

  preencherSolicitante(solicitante: Colaborador): void {
    this.buscaColaboradoresComponent.preencherSolicitante(solicitante);
  }

  opcoesIniciais(): void {
    this.buscaColaboradoresComponent.opcoesIniciais();
  }

  get value(): Colaborador {
    return this.formDadosColaborador.getRawValue() as Colaborador;
  }

  validarForm(): boolean {
    return this.buscaColaboradoresComponent.validarForm();
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  desabilitarForm(): void {
    this.formDadosColaborador.disable();
  }
}
