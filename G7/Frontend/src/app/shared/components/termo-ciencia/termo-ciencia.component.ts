import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-termo-ciencia',
  templateUrl: './termo-ciencia.component.html',
  styleUrls: ['./termo-ciencia.component.scss'],
})
export class TermoCienciaComponent {
  termoSelecionado = false;
  formTermoCiencia: FormGroup = this.fb.group({
    termoCiencia: { value: false, disabled: false },
  });
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

  get value(): boolean {
    return this.termoSelecionado;
  }
  setValue(selecionado: boolean): void {
    this.termoSelecionado = selecionado;
  }

  desabilitarForm(): void {
    this.formTermoCiencia.get('termoCiencia').disable();
  }

  validarForm(): boolean {
    if (!this.termoSelecionado)
      this.notification.error(
        'Atenção',
        'É obrigatório concordar com os termos de ciência'
      );

    return this.termoSelecionado;
  }
}
