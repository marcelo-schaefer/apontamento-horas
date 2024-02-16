import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { MotivoDesligamento } from 'src/app/services/desligamento/models/motivo-desligamento';
import { Motivo } from 'src/app/services/desligamento/models/motivo';
import { isValid, format } from 'date-fns';
import { DadoDesligamento } from '../../model/dado-desligamento';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-dados-desligamento',
  templateUrl: './dados-desligamento.component.html',
  styleUrls: ['./dados-desligamento.component.scss'],
})
export class DadosDesligamentoComponent implements OnInit {
  @ViewChild(FileUploadComponent, { static: true })
  fileUploadComponent: FileUploadComponent;

  @Output()
  causaDemissaoSelecionada = new EventEmitter<number>();

  formDadosDesligamento: FormGroup;

  solicitante: Colaborador;
  motivosDesligamento: MotivoDesligamento;
  listaAvisoPrevio: Motivo[];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

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
      dataAvisoPrevio: [
        { value: null, disabled: false },
        [Validators.required, this.avisoPrevioAntesDemissao],
      ],
      aLiberacaoAvisoPrevio: { value: '', disabled: false },
      anexoDocumento: [[]],
    });
  }

  preencherFormulario(dados: DadoDesligamento): void {
    this.preencheMotivosDesligamento(dados.motivosDesligamento);
    this.formDadosDesligamento.patchValue({
      ...dados,
      dataDemissao: new Date(dados.dataDemissao),
      dataPagamento: new Date(dados.dataPagamento),
      dataAvisoPrevio: new Date(dados.dataAvisoPrevio),
    });
  }

  preencheSolicitante(solicitante: Colaborador): void {
    this.solicitante = JSON.parse(JSON.stringify(solicitante)) as Colaborador;
  }

  apresentarComoValidador(): void {
    this.solicitante.AEhGestor = 'S';
    this.solicitante.AEhRhu = 'S';
  }

  preencheMotivosDesligamento(motivosDesligamento: MotivoDesligamento): void {
    this.motivosDesligamento = motivosDesligamento;
    this.preencheListaAvisoPrevio();
  }

  dataDemissaoPreenchida(data: Date): void {
    this.validarDataAvisoPrevio();
    this.preencherDataPagamento(data);
  }

  preencherDataPagamento(data: Date): void {
    data = new Date(data);
    if (isValid(data))
      this.formDadosDesligamento
        .get('dataPagamento')
        .setValue(data.setDate(data.getDate() + 10));
  }

  validarDataAvisoPrevio(): void {
    if (this.valueForm.dataAvisoPrevio) {
      this.formDadosDesligamento.get('dataAvisoPrevio').markAsDirty();
      this.formDadosDesligamento
        .get('dataAvisoPrevio')
        .updateValueAndValidity();
    }
  }

  get valueForm(): DadoDesligamento {
    return this.formDadosDesligamento.getRawValue() as DadoDesligamento;
  }

  get value(): DadoDesligamento {
    const form = this.valueForm;
    return {
      ...form,
      dDataDemissao: this.formataData(form.dataDemissao),
      dDataPagamento: this.formataData(form.dataPagamento),
      dDataAvisoPrevio: this.formataData(form.dataAvisoPrevio),
      anexoDocumento: this.fileUploadComponent.attachments[0],
      causaDemissao:
        form.nCausaDemissao.toString() +
        ' - ' +
        this.motivosDesligamento.causaDemissao.find(
          (f) => f.NCodigo == form.nCausaDemissao
        ).ADescricao,
      motivoDesligamento:
        form.nMotivoDesligamento.toString() +
        ' - ' +
        this.motivosDesligamento.motivoDesligamento.find(
          (f) => f.NCodigo == form.nMotivoDesligamento
        ).ADescricao,
      liberarAvisoPrevio: form.aLiberacaoAvisoPrevio == 'S' ? 'Sim' : 'Não',
      avisoPrevio:
        form.nAvisoPrevio.toString() +
        ' - ' +
        this.listaAvisoPrevio.find((f) => f.NCodigo == form.nAvisoPrevio)
          .ADescricao,
      motivosDesligamento: this.motivosDesligamento,
      listaAvisoPrevio: this.listaAvisoPrevio,
    } as DadoDesligamento;
  }

  validarForm(): boolean {
    if (this.solicitante.AEhGestor == 'S' || this.solicitante.AEhRhu == 'S')
      this.formDadosDesligamento
        .get('aLiberacaoAvisoPrevio')
        .setValidators(Validators.required);

    for (const i of Object.keys(this.formDadosDesligamento.controls)) {
      this.formDadosDesligamento.controls[i].markAsDirty();
      this.formDadosDesligamento.controls[i].updateValueAndValidity();
    }

    if (this.fileUploadComponent.attachments.length < 1)
      this.notification.error('Atenção', 'É obrigatorio incluir um anexo');

    return (
      (this.formDadosDesligamento.valid ||
        this.formDadosDesligamento.disabled) &&
      this.fileUploadComponent.attachments.length > 0
    );
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  desabilitarForm(): void {
    this.formDadosDesligamento.disable();
    this.fileUploadComponent.desabilitarForm();
  }

  habilitarParaValidacoes(): void {
    this.formDadosDesligamento.get('aLiberacaoAvisoPrevio').disable();
    this.formDadosDesligamento.get('dataPagamento').enable();
    this.fileUploadComponent.desabilitarForm();
  }

  habilitarAvisoPrevio(): void {
    this.formDadosDesligamento.get('aLiberacaoAvisoPrevio').enable();
  }

  desabilitarAvisoPrevio(): void {
    this.formDadosDesligamento.get('aLiberacaoAvisoPrevio').disable();
  }

  preencheListaAvisoPrevio(): void {
    this.listaAvisoPrevio = [
      { NCodigo: 1, ADescricao: 'Trabalhado' } as Motivo,
      { NCodigo: 2, ADescricao: 'Indenizado' } as Motivo,
      { NCodigo: 3, ADescricao: 'Ausência/Dispensa' } as Motivo,
    ];

    if (this.solicitante.AEhGestor == 'S' || this.solicitante.AEhRhu == 'S')
      this.listaAvisoPrevio = this.listaAvisoPrevio.concat([
        {
          NCodigo: 4,
          ADescricao: 'Trabalhado Parcial (Novo Emprego)',
        } as Motivo,
        {
          NCodigo: 5,
          ADescricao: 'Trabalhado Parcial (Iniciativa Empregador',
        } as Motivo,
        {
          NCodigo: 6,
          ADescricao: 'Outras Hipóteses de Cumprimento Parcial',
        } as Motivo,
      ]);
  }

  avisoPrevioAntesDemissao = (
    control: AbstractControl
  ): { avisoPrevioAntesDemissao: boolean } => {
    if (!control.value || !this.valueForm.dataDemissao) return null;

    if (
      this.dataHorasZeradas(control.value) >
      this.dataHorasZeradas(this.valueForm.dataDemissao)
    )
      return {
        avisoPrevioAntesDemissao: true,
      };
    return null;
  };

  emitirCausaDemissao(causa: number): void {
    this.causaDemissaoSelecionada.emit(causa);
  }

  formataData(data: Date): string {
    return format(data, 'dd/MM/yyyy');
  }

  dataHorasZeradas(data: Date): Date {
    data.setHours(0, 0, 0, 0);
    return data;
  }
}
