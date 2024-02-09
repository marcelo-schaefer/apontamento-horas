import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { MotivoDesligamento } from 'src/app/services/desligamento/models/motivo-desligamento';
import { Motivo } from 'src/app/services/desligamento/models/motivo';

@Component({
  selector: 'app-dados-desligamento',
  templateUrl: './dados-desligamento.component.html',
  styleUrls: ['./dados-desligamento.component.scss'],
})
export class DadosDesligamentoComponent implements OnInit {
  formDadosDesligamento: FormGroup;

  solicitante: Colaborador;
  motivosDesligamento: MotivoDesligamento;
  listaAvisoPrevio: Motivo[];
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formDadosDesligamento = this.fb.group({
      nCausaDemissao: [{ value: '', disabled: false }, Validators.required],
      nMotivoDesligamento: [
        { value: '', disabled: false },
        Validators.required,
      ],
      dataDemissao: [{ value: null, disabled: false }, Validators.required],
      dataPagamento: { value: null, disabled: true },
      nAvisoPrevio: [{ value: '', disabled: false }, Validators.required],
      dataAvisoPrevio: [{ value: null, disabled: false }, Validators.required],
      aLiberacaoAvisoPrevio: [
        { value: '', disabled: false },
        Validators.required,
      ],
      anexoDocumento: [[], []],
    });
  }

  preencheSolicitante(solicitante: Colaborador): void {
    this.solicitante = solicitante;
  }

  preencheMotivosDesligamento(motivosDesligamento: MotivoDesligamento): void {
    this.motivosDesligamento = motivosDesligamento;
    this.preencheListaAvisoPrevio();
  }

  get value(): Colaborador {
    return this.formDadosDesligamento.getRawValue() as Colaborador;
  }

  validarForm(): boolean {
    for (const i of Object.keys(this.formDadosDesligamento.controls)) {
      this.formDadosDesligamento.controls[i].markAsDirty();
      this.formDadosDesligamento.controls[i].updateValueAndValidity();
    }

    return this.formDadosDesligamento.valid;
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  desabilitarForm(): void {
    this.formDadosDesligamento.disable();
  }

  preencheListaAvisoPrevio(): void {
    this.listaAvisoPrevio = [
      { NCodigo: 1, ADescricao: 'Trabalhado' } as Motivo,
      { NCodigo: 2, ADescricao: 'Indenizado' } as Motivo,
      { NCodigo: 3, ADescricao: 'Ausência/Dispensa' } as Motivo,
      { NCodigo: 4, ADescricao: 'Trabalhado Parcial (Novo Emprego)' } as Motivo,
      {
        NCodigo: 5,
        ADescricao: 'Trabalhado Parcial (Iniciativa Empregador',
      } as Motivo,
      {
        NCodigo: 6,
        ADescricao: 'Outras Hipóteses de Cumprimento Parcial',
      } as Motivo,
    ];
  }
}
