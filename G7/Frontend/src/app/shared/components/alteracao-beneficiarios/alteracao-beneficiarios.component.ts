import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { Parentesco } from 'src/app/services/seguro-vida/models/parentesco';
import { Dependente } from 'src/app/services/seguro-vida/models/dependente';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-alteracao-beneficiarios',
  templateUrl: './alteracao-beneficiarios.component.html',
  styleUrls: ['./alteracao-beneficiarios.component.scss'],
})
export class AlteracaoBeneficiariosComponent implements OnInit {
  formDadosSolicitacao: FormGroup;

  isLoading = false;
  desabilitarBotoes = false;

  listaParentescos: Parentesco[];

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formDadosSolicitacao = this.fb.group({
      dependentes: this.fb.array([]),
    });
  }

  preencherListaParentescos(parentescos: Parentesco[]): void {
    this.listaParentescos = parentescos;
  }

  get value(): Dependente[] {
    return this.dependentes.controls.map((form: FormGroup) => {
      return {
        ...form.getRawValue(),
        nCodigoParentesco: (form.get('parentesco').value as Parentesco)
          .NCodigoParentesco,
        aDataNascimento: format(form.get('dataNascimento').value, 'dd/MM/yyyy'),
      } as Dependente;
    });
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  desabilitarForm(): void {
    this.formDadosSolicitacao.disable();
    this.desabilitarBotoes = true;
  }

  habilitarForm(): void {
    this.formDadosSolicitacao.enable();
    this.desabilitarBotoes = false;
  }

  validarForm(): boolean {
    if (this.dependentes.length < 1)
      this.notification.error(
        'Atenção',
        'Obrigatório informar no mínimo um beneficiário'
      );

    this.dependentes.controls.forEach((formGroup: FormGroup) => {
      for (const i of Object.keys(formGroup.controls)) {
        if (i == 'nDistribuicao')
          formGroup.controls[i].setValidators([
            Validators.required,
            this.distribuicaoMaiorQueCem,
            this.distribuicaoNaoAtingeCem,
            this.distribuicaoZerada,
          ]);
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    });

    return this.dependentes.length > 0 && this.dependentes.valid;
  }

  marcarErrosDistribuicao(): void {
    this.dependentes.controls.forEach((formGroup: FormGroup) => {
      for (const i of Object.keys(formGroup.controls)) {
        if (i == 'nDistribuicao') {
          formGroup.controls[i].markAsDirty();
          formGroup.controls[i].updateValueAndValidity();
        }
      }
    });
  }

  private criarFormGroupParaLinha(): FormGroup {
    return this.fb.group({
      aNome: [{ value: '', disabled: false }, [Validators.required]],
      parentesco: [{ value: '', disabled: false }, [Validators.required]],
      dataNascimento: [{ value: null, disabled: false }, [Validators.required]],
      nDistribuicao: [
        { value: '', disabled: false },
        [Validators.required, this.distribuicaoMaiorQueCem],
      ],
    });
  }

  private criarFormGroupParaLinhaComValor(dependente: Dependente): FormGroup {
    return this.fb.group({
      aNome: dependente.aNome,
      parentesco: this.listaParentescos.find(
        (f) => f.NCodigoParentesco == dependente.parentesco.NCodigoParentesco
      ),
      dataNascimento: new Date(dependente.dataNascimento),
      nDistribuicao: dependente.nDistribuicao.toString() + '%',
    });
  }

  get dependentes(): FormArray {
    return this.formDadosSolicitacao.get('dependentes') as FormArray;
  }

  distribuicaoMaiorQueCem = (
    control: AbstractControl
  ): { distribuicaoMaiorQueCem: boolean } => {
    if (!control.value) return null;

    if (
      this.dependentes.controls.reduce(
        (acumulador, elemento: FormGroup) =>
          acumulador + (Number(elemento.get('nDistribuicao').value) || 0),
        0
      ) > 100
    ) {
      return {
        distribuicaoMaiorQueCem: true,
      };
    }
    return null;
  };

  distribuicaoNaoAtingeCem = (
    control: AbstractControl
  ): { distribuicaoNaoAtingeCem: boolean } => {
    if (!control.value || Number(control.value) < 1) return null;

    if (
      this.dependentes.controls.reduce(
        (acumulador, elemento: FormGroup) =>
          acumulador + (Number(elemento.get('nDistribuicao').value) || 0),
        0
      ) < 100
    ) {
      return {
        distribuicaoNaoAtingeCem: true,
      };
    }
    return null;
  };

  distribuicaoZerada = (
    control: AbstractControl
  ): { distribuicaoZerada: boolean } => {
    if (!control.value) return null;

    if (Number(control.value) < 1) {
      return {
        distribuicaoZerada: true,
      };
    }
    return null;
  };

  adicioanrLinha(): void {
    this.dependentes.push(this.criarFormGroupParaLinha());
  }

  preencherDependentes(dependentes: Dependente[]): void {
    dependentes.forEach((dependente) => {
      this.dependentes.push(this.criarFormGroupParaLinhaComValor(dependente));
    });
  }

  excluir(index: number): void {
    this.dependentes.removeAt(index);
  }
}
