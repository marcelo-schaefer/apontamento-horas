import { Dependente } from './../../model/dependente';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { DadosSolicitacao } from '../../model/dados-solicitacao';
import { format } from 'date-fns';

@Component({
  selector: 'app-dados-solicitacao',
  templateUrl: './dados-solicitacao.component.html',
  styleUrls: ['./dados-solicitacao.component.scss'],
})
export class DadosSolicitacaoComponent implements OnInit {
  formDadosSolicitacao: FormGroup;

  isLoading = false;
  desabiliatrCheckBox = false;
  allChecked = false;
  indeterminate = false;

  tipoSolicitacao = 0;

  porcentagemContribuicaoBasica = ['1', '2', '3', '4', '5'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formDadosSolicitacao = this.fb.group({
      contribuicao: [{ value: '', disabled: false }, Validators.required],
      porcentagemContribuicaoBasica: [
        { value: '', disabled: false },
        Validators.required,
      ],
      porcentagemContribuicaoVoluntaria: [
        { value: '', disabled: false },
        Validators.required,
      ],
      regime: [{ value: '', disabled: false }, Validators.required],
      pessoaPolitica: false,
      dependentes: this.fb.array([]),
    });
  }

  preencherFormulario(solicitante: Colaborador): void {
    if (solicitante?.APossuiBeneficio == 'S')
      this.formDadosSolicitacao.patchValue({
        contribuicao: solicitante.AContribuicao,
        regime: solicitante.ARegime,
        porcentagemContribuicaoBasica:
          this.tipoSolicitacao == 2 ? 0 : solicitante.APorcentagemContribuicao,
        porcentagemContribuicaoVoluntaria:
          this.tipoSolicitacao == 2 ? 0 : solicitante.APorcentagemContribuicao,
        pessoaPolitica: solicitante.APessoaPolitica == 'S',
      });
  }

  preencherFormularioCompleto(solicitacao: DadosSolicitacao): void {
    this.formDadosSolicitacao.patchValue({
      ...solicitacao,
    });
    this.preencherDependentes(solicitacao.dependentes);
  }

  get value(): DadosSolicitacao {
    return {
      ...this.formDadosSolicitacao.getRawValue(),
      porcentagemContribuicao:
        this.formDadosSolicitacao.get('contribuicao').value == 'basica'
          ? (this.formDadosSolicitacao.get('porcentagemContribuicaoBasica')
              .value as string)
          : (this.formDadosSolicitacao.get('porcentagemContribuicaoVoluntaria')
              .value as string),
      contribuicaoFormatada:
        this.formDadosSolicitacao.get('contribuicao').value == 'basica'
          ? 'Básica'
          : 'Voluntária',
      regimeFormatado:
        this.formDadosSolicitacao.get('regime').value == 'progressivo'
          ? 'Progressivo'
          : 'Regressivo',
      pessoaPolitica: this.formDadosSolicitacao.get('regime').value ? 'S' : 'N',
      dependentes: this.valueDependentesSelecionados,
    } as DadosSolicitacao;
  }

  get valueDependentesSelecionados(): Dependente[] {
    return this.dependentes.controls
      .filter((dependente) => dependente.get('selecionado').value)
      .map((dependente) => {
        return {
          selecionado: dependente.get('selecionado').value as boolean,
          NId: dependente.get('id').value as number,
          ANome: dependente.get('nome').value as string,
          DDataNascimento: dependente.get('editarCampos')?.value
            ? this.formatarDataParaString(
                dependente.get('dataNascimento').value as Date
              )
            : (dependente.get('dataNascimento').value as string),
          ACpf: dependente.get('cpf').value as string,
        } as Dependente;
      });
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  limitarNumero(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue: number = parseFloat(inputElement.value);

    if (inputValue > 30) {
      this.formDadosSolicitacao
        .get('porcentagemContribuicaoVoluntaria')
        .setValue('30');
    }
  }

  desabilitarForm(): void {
    this.formDadosSolicitacao.disable();
    this.desabiliatrCheckBox = true;
  }
  habilitarForm(): void {
    this.formDadosSolicitacao.enable();
    this.desabiliatrCheckBox = false;
  }

  validarForm(): boolean {
    this.dependentes.controls.forEach((formGroup: FormGroup) => {
      if (formGroup.get('selecionado').value)
        for (const i of Object.keys(formGroup.controls)) {
          formGroup.controls[i].markAsDirty();
          formGroup.controls[i].updateValueAndValidity();
        }
    });

    for (const i of Object.keys(this.formDadosSolicitacao.controls)) {
      this.formDadosSolicitacao.controls[i].markAsDirty();
      this.formDadosSolicitacao.controls[i].updateValueAndValidity();
    }

    return (
      this.formDadosSolicitacao.valid &&
      this.dependentes.controls.filter(
        (dependente) => dependente.get('selecionado').value && !dependente.valid
      ).length == 0
    );
  }

  private criarFormGroupParaLinha(): FormGroup {
    return this.fb.group({
      selecionado: true,
      id: null,
      nome: [{ value: '', disabled: false }, [Validators.required]],
      dataNascimento: [{ value: null, disabled: false }, [Validators.required]],
      cpf: [{ value: '', disabled: false }, [Validators.required]],
      editarCpf: true,
      editarCampos: true,
    });
  }

  private criarFormGroupParaLinhaComValor(dependente: Dependente): FormGroup {
    return this.fb.group({
      selecionado:
        dependente?.APossuiPrevidencia == 'S' || dependente?.selecionado,
      id: dependente.NId,
      nome: dependente.ANome,
      dataNascimento: dependente.DDataNascimento,
      cpf: [
        this.formataCpf(
          !this.verificaCpfZerado(dependente?.ACpf) ? dependente?.ACpf : ''
        ),
        dependente?.APossuiPrevidencia == 'S' ? [Validators.required] : [],
      ],
      editarCpf: this.verificaCpfZerado(dependente?.ACpf),
    });
  }

  get dependentes(): FormArray {
    return this.formDadosSolicitacao.get('dependentes') as FormArray;
  }

  adicioanrLinha(): void {
    this.dependentes.push(this.criarFormGroupParaLinha());
  }

  preencherDependentes(dependentes: Dependente[]): void {
    if (this.dependentes.controls.length < 1)
      dependentes.forEach((dependente) => {
        this.dependentes.push(this.criarFormGroupParaLinhaComValor(dependente));
      });
  }

  checkAll(checked: boolean): void {
    this.dependentes.controls.forEach((group: FormGroup) =>
      group.get('selecionado').setValue(checked)
    );
  }

  isCheckedAt(idx: number): boolean {
    return this.dependentes.at(idx).get('selecionado').value as boolean;
  }

  checkedAt(checked: boolean, idx: number): void {
    if (checked) {
      this.dependentes.at(idx).get('nome').setValidators([Validators.required]);
      this.dependentes
        .at(idx)
        .get('dataNascimento')
        .setValidators([Validators.required]);
      this.dependentes.at(idx).get('cpf').setValidators([Validators.required]);
    } else {
      this.dependentes.at(idx).get('nome').clearValidators();
      this.dependentes.at(idx).get('nome').updateValueAndValidity();
      this.dependentes.at(idx).get('dataNascimento').clearValidators();
      this.dependentes.at(idx).get('dataNascimento').updateValueAndValidity();
      this.dependentes.at(idx).get('cpf').clearValidators();
      this.dependentes.at(idx).get('cpf').updateValueAndValidity();
    }
    const every = this.dependentes.controls.every(
      (group: FormGroup) => group.get('selecionado').value
    );
    const some = this.dependentes.controls.some(
      (group: FormGroup) => group.get('selecionado').value
    );

    this.allChecked = every;
    this.indeterminate = some && !every;
  }

  definirTipoSolicitacao(tipoSolicitacao: number): void {
    this.tipoSolicitacao = tipoSolicitacao;

    if (this.tipoSolicitacao == 2) this.desabilitarForm();
    else this.habilitarForm();
  }

  excluirData(index: number): void {
    this.dependentes.removeAt(index);
  }

  formatarDataParaString(data: Date): string {
    return format(data, 'dd/MM/yyyy');
  }

  formataCpf(cpf: string): string {
    if (cpf.indexOf('.') < 0) {
      cpf = cpf.replace(/[^\d]/g, '');
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }

  contribuicaoSelecionada(contribuicao: string): void {
    if (contribuicao == 'basica') {
      this.formDadosSolicitacao
        .get('porcentagemContribuicaoBasica')
        .setValidators([Validators.required]);
      this.formDadosSolicitacao
        .get('porcentagemContribuicaoVoluntaria')
        .clearValidators();
    } else {
      this.formDadosSolicitacao
        .get('porcentagemContribuicaoBasica')
        .clearValidators();
      this.formDadosSolicitacao
        .get('porcentagemContribuicaoVoluntaria')
        .setValidators([Validators.required]);
    }
  }

  verificaCpfZerado(cpf: string): boolean {
    if (cpf && cpf != '?') {
      const cpfDesformatado = cpf
        .replace('.', '')
        .replace('.', '')
        .replace('-', '');
      return Number(cpfDesformatado) < 1;
    } else return true;
  }
}
