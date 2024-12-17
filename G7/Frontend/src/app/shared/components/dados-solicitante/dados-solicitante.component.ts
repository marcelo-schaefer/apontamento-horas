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
  comErro = false;
  mensagemErro = '';
  causaDesligamento = 0;

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
      cargoSolicitante: { value: '', disabled: true },
      centroCustoSolicitante: { value: '', disabled: true },
      solicitantePcd: { value: '', disabled: true },
      solicitantePom: { value: '', disabled: true },
      NMatricula: { value: '', disabled: true },
      ANome: { value: '', disabled: true },
      NTipoColaborador: { value: '', disabled: true },
      NCodigoEmpresa: { value: '', disabled: true },
      ADescricaoEmpresa: { value: '', disabled: true },
      NCodigoFilial: { value: '', disabled: true },
      ADescricaoFilial: { value: '', disabled: true },
      ACodigoPosto: { value: '', disabled: true },
      ADescricaoPosto: { value: '', disabled: true },
      ACodigoCargo: { value: '', disabled: true },
      ADescricaoCargo: { value: '', disabled: true },
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
      APapelBp: { value: '', disabled: true },
      AEhAtacadao: { value: '', disabled: true },
      ATemEstabilidade: { value: '', disabled: true },
      dataAso: { value: '', disabled: true },
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
      cargoSolicitante:
        solicitante.ACodigoCargo + ' - ' + solicitante.ADescricaoCargo,
      postoSolicitante:
        solicitante.ACodigoPosto + ' - ' + solicitante.ADescricaoPosto,
      centroCustoSolicitante:
        solicitante.ACodigoCentroCusto +
        ' - ' +
        solicitante.ADescricaoCentroCusto,
      solicitantePcd: solicitante.AColaboradorPcd == 'S' ? 'Sim' : 'Não',
      solicitantePom: solicitante.AColaboradorPom == 'S' ? 'Sim' : 'Não',
    });
    this.validacoesDeSolicitacao();
  }

  preencherDataASO(dataAso: string): void {
    this.formDadosSolicitante.get('dataAso').setValue(dataAso);
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

  preencherCausaDesligamento(causa: number): void {
    this.causaDesligamento = causa;
  }

  validarForm(): boolean {
    return !this.comErro;
  }

  validacoesDeSolicitacao(): void {
    this.comErro =
      this.validarGerenteRegional() ||
      this.validarlimiteDesligamento() ||
      this.validarEstabilidadeEPom();

    if (this.validarGerenteRegional())
      this.mensagemErro =
        'Prezado! Não foi encontrato um gerente regional para o colaborador e essa solicitação não poderá seguir';
    if (this.validarlimiteDesligamento())
      this.mensagemErro =
        'Prezado(a), para prosseguir com a solicitação de desligamento por favor contate o RH de sua unidade';
    if (this.validarEstabilidadeEPom())
      this.mensagemErro =
        'Prezado! Não será possível seguir com essa solicitação, por favor entre em contato com o RH';
  }

  validarGerenteRegional(): boolean {
    return (
      this.solicitante.AEhGestor != 'S' &&
      this.solicitante.AEhRhu != 'S' &&
      !this.solicitante.AUsuarioGestorRegional
    );
  }

  validarEstabilidadeEPom(): boolean {
    return (
      this.solicitante.AEhGestor != 'S' &&
      this.solicitante.AEhRhu != 'S' &&
      (this.solicitante.ATemEstabilidade == 'S' ||
        this.solicitante.AColaboradorPom == 'S')
    );
  }

  validarlimiteDesligamento(): boolean {
    return this.solicitante.AForaLimiteDesligamento == 'S';
  }
}
