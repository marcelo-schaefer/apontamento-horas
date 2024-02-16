import { ObservacaoForm } from '../../model/observacao-form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input } from '@angular/core';
import {
  campoObrigatorio,
  regexNoWhiteSpacesOnly,
} from 'src/app/utils/form-utils';

@Component({
  selector: 'app-observacao',
  templateUrl: './observacao.component.html',
  styleUrls: ['./observacao.component.scss'],
})
export class ObservacaoComponent {
  constructor(private fb: FormBuilder) {}

  campoObrigatorio = campoObrigatorio;

  regexNoWhiteSpacesOnly = regexNoWhiteSpacesOnly;

  formObservacao: FormGroup = this.fb.group({
    observacao: [{ value: null, disabled: false }, [Validators.maxLength(400)]],
    aprovarAvisoPrevio: { value: '', disabled: false },
  });

  @Input() label = 'Observação do Solicitante';
  @Input() labelTitle = 'Observação';
  @Input() apresentarAprovarAvisoPrevio = false;

  formularioValido(): boolean {
    for (const key in this.formObservacao.controls) {
      this.formObservacao.controls[key].markAsDirty();
      this.formObservacao.controls[key].updateValueAndValidity();
    }
    return this.formObservacao.valid || this.formObservacao.disabled;
  }

  get value(): ObservacaoForm {
    const valoresFormularioObservacao =
      this.formObservacao.getRawValue() as ObservacaoForm;

    const observacoes: ObservacaoForm = {
      observacao: valoresFormularioObservacao.observacao,
    };

    return observacoes;
  }

  get valueAvisoPrevio(): string {
    return this.formObservacao.get('aprovarAvisoPrevio').value as string;
  }

  preencherDados(observacao: string): void {
    this.formObservacao.patchValue({ observacao });
  }

  desabilitar(): void {
    this.formObservacao.disable();
  }

  apresentarAvisoPrevio(): void {
    this.apresentarAprovarAvisoPrevio = true;
    this.formObservacao
      .get('aprovarAvisoPrevio')
      .setValidators(Validators.required);
  }

  preencherAvisoPrevio(aprova: string): void {
    this.formObservacao.get('aprovarAvisoPrevio').setValue(aprova);
  }

  tornarObrigatorio(): void {
    this.formObservacao
      .get('observacao')
      .setValidators([
        Validators.required,
        Validators.pattern(this.regexNoWhiteSpacesOnly),
        Validators.maxLength(400),
      ]);
  }

  tornarOpcional(): void {
    this.formObservacao.get('observacao').clearValidators();
    this.formObservacao
      .get('observacao')
      .setValidators(Validators.maxLength(400));
  }
}
