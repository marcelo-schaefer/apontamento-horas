import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PlanoSeguroVida } from 'src/app/services/seguro-vida/models/plano-seguro-vida';

@Component({
  selector: 'app-dados-plano-vida',
  templateUrl: './dados-plano-vida.component.html',
  styleUrls: ['./dados-plano-vida.component.scss'],
})
export class DadosPlanoVidaComponent implements OnInit {
  formDadosPlanoVida: FormGroup;

  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formDadosPlanoVida = this.fb.group({
      NCodigoPlano: { value: '', disabled: true },
      ADescricaoPlano: { value: '', disabled: true },
      NCodigoOperadora: { value: '', disabled: true },
      ADescricaoOperadora: { value: '', disabled: true },
      plano: { value: '', disabled: true },
      operadora: { value: '', disabled: true },
    });
  }

  preencherFormulario(plano: PlanoSeguroVida): void {
    this.formDadosPlanoVida.patchValue({
      ...plano,
      plano: plano.NCodigoPlano.toString() + ' - ' + plano.ADescricaoPlano,
      operadora:
        plano.NCodigoOperadora.toString() + ' - ' + plano.ADescricaoOperadora,
    });
  }

  get value(): PlanoSeguroVida {
    return this.formDadosPlanoVida.getRawValue() as PlanoSeguroVida;
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  desabilitarForm(): void {
    this.formDadosPlanoVida.disable();
  }
}
