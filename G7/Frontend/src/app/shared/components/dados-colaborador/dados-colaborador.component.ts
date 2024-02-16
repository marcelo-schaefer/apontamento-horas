import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { BuscaColaboradoresComponent } from '../busca-colaboradores/busca-colaboradores.component';
import { ColaboradorDesligado } from '../../model/colaborador-desligado';

@Component({
  selector: 'app-dados-colaborador',
  templateUrl: './dados-colaborador.component.html',
  styleUrls: ['./dados-colaborador.component.scss'],
})
export class DadosColaboradorComponent implements OnInit {
  @ViewChild(BuscaColaboradoresComponent, { static: true })
  buscaColaboradoresComponent: BuscaColaboradoresComponent;

  formDadosColaborador: FormGroup;

  colaboradorSelecionado: Colaborador;
  isLoading = false;

  cousaDemissao: number;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formDadosColaborador = this.fb.group({
      colaboradorSelecionado: { value: '', disabled: true },
      matriculaColaborador: { value: '', disabled: true },
      nomeColaborador: { value: '', disabled: true },
      postoColaborador: { value: '', disabled: true },
      centroCustoColaborador: { value: '', disabled: true },
      dataAdmissaoColaborador: { value: '', disabled: true },
      colaboradorDesligadoPcd: { value: '', disabled: true },
      colaboradorDesligadoPom: { value: '', disabled: true },
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
      AUsuarioGestor: { value: '', disabled: true },
      APapelRhu: { value: '', disabled: true },
      AEhAtacadao: { value: '', disabled: true },
    });
  }

  preencherColaboradorSelecionado(colaborador: Colaborador): void {
    this.colaboradorSelecionado = colaborador;
    this.formDadosColaborador.patchValue({
      ...colaborador,
      colaboradorSelecionado:
        colaborador.NMatricula.toString() + ' - ' + colaborador.ANome,
      matriculaColaborador: colaborador.NMatricula,
      nomeColaborador: colaborador.ANome,
      postoColaborador:
        colaborador.ACodigoPosto + ' - ' + colaborador.ADescricaoPosto,
      centroCustoColaborador:
        colaborador.ACodigoCenrtoCusto +
        ' - ' +
        colaborador.ADescricaoCenrtoCusto,
      dataAdmissaoColaborador: colaborador.DDataAdmissao,
      colaboradorDesligadoPcd:
        colaborador.AColaboradorPcd == 'S' ? 'Sim' : 'Não',
      colaboradorDesligadoPom:
        colaborador.AColaboradorPom == 'S' ? 'Sim' : 'Não',
    });
  }

  preencherFormulario(colaborador: Colaborador): void {
    this.buscaColaboradoresComponent.preencherColaborador(colaborador);
  }

  preencherSolicitante(solicitante: Colaborador): void {
    this.buscaColaboradoresComponent.preencherSolicitante(solicitante);
  }

  opcoesIniciais(): void {
    this.buscaColaboradoresComponent.opcoesIniciais();
  }

  get value(): ColaboradorDesligado {
    return this.formDadosColaborador.getRawValue() as ColaboradorDesligado;
  }

  validarForm(): boolean {
    return this.buscaColaboradoresComponent.validarForm();
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  desabilitarForm(): void {
    this.buscaColaboradoresComponent.desabilitarForm();
  }

  definirCausaDemissao(causa: number): void {
    this.cousaDemissao = causa;
  }
}
