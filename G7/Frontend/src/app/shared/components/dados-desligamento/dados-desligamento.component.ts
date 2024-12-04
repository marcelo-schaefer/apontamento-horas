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
import { DatePickerCustomComponent } from '../date-picker-custom/date-picker-custom.component';

@Component({
  selector: 'app-dados-desligamento',
  templateUrl: './dados-desligamento.component.html',
  styleUrls: ['./dados-desligamento.component.scss'],
})
export class DadosDesligamentoComponent implements OnInit {
  @ViewChild('dataDesligamentoComponent', { static: true })
  dataDesligamentoComponent: DatePickerCustomComponent;

  @ViewChild(FileUploadComponent, { static: true })
  fileUploadComponent: FileUploadComponent;

  @Output()
  causaDemissaoSelecionada = new EventEmitter<number>();

  formDadosDesligamento: FormGroup;

  solicitante: Colaborador;
  colaboradorSelecionado: Colaborador;
  today = new Date();
  motivosDesligamento: MotivoDesligamento;
  listaAvisoPrevio: Motivo[];
  listaMotivosGestorRhu = [1, 2, 4, 8, 9, 10, 11, 12, 13, 14, 26, 27, 28];
  isLoading = false;
  comErroDataBase = false;

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
      dataDemissao: [{ value: null, disabled: true }, Validators.required],
      dataPagamento: { value: null, disabled: true },
      validacaoJuridico: [{ value: '', disabled: false }, Validators.required],
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

  preencheColaboradorSelecionado(colaboradorSelecionado: Colaborador): void {
    this.colaboradorSelecionado = JSON.parse(
      JSON.stringify(colaboradorSelecionado)
    ) as Colaborador;
  }

  apresentarComoValidador(): void {
    this.solicitante.AEhGestor = 'S';
    this.solicitante.AEhRhu = 'S';
  }

  preencheMotivosDesligamento(motivosDesligamento: MotivoDesligamento): void {
    this.motivosDesligamento = motivosDesligamento;
    this.filtrarCausasParaColaborador();
    this.filtrarCausasParaGestorRhu();
    this.preencheListaAvisoPrevio();
  }

  dataDemissaoPreenchida(): void {
    if (
      this.valueForm.nCausaDemissao &&
      this.valueForm.nAvisoPrevio &&
      this.valueForm.dataDemissao
    )
      this.preencherDataPagamento();

    this.comErroDataBase = this.dataDemissaoAntesDaDataDeSolicitacao();
  }

  preencherDataPagamento(): void {
    let data: Date;
    if (
      [2, 4, 27, 28].includes(Number(this.valueForm.nCausaDemissao)) &&
      this.valueForm.nAvisoPrevio == 1
    )
      data = new Date(this.valueForm.dataAvisoPrevio);
    else data = new Date(this.valueForm.dataDemissao);
    if (isValid(data))
      this.formDadosDesligamento
        .get('dataPagamento')
        .setValue(data.setDate(data.getDate() + 9));
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

  filtrarCausasParaColaborador(): void {
    if (this.solicitante?.AEhGestor != 'S' && this.solicitante?.AEhRhu != 'S')
      this.motivosDesligamento.causaDemissao =
        this.motivosDesligamento.causaDemissao.filter((f) =>
          this.solicitante.NCodVinculo == '56'
            ? f.NCodigo == 26
            : f.NCodigo == 4 || f.NCodigo == 12 || f.NCodigo == 14
        );
  }

  filtrarCausasParaGestorRhu(): void {
    if (this.solicitante?.AEhGestor == 'S' || this.solicitante?.AEhRhu == 'S')
      this.motivosDesligamento.causaDemissao =
        this.motivosDesligamento.causaDemissao.filter((f) =>
          this.listaMotivosGestorRhu.includes(Number(f.NCodigo))
        );
  }

  preencheListaAvisoPrevio(): void {
    this.listaAvisoPrevio = [
      { NCodigo: 1, ADescricao: 'Trabalhado' } as Motivo,
      { NCodigo: 2, ADescricao: 'Indenizado' } as Motivo,
    ];

    if (this.solicitante.AEhGestor == 'S' || this.solicitante.AEhRhu == 'S')
      this.listaAvisoPrevio = this.listaAvisoPrevio.concat([
        { NCodigo: 3, ADescricao: 'Ausência/Dispensa' } as Motivo,
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

  dataDemissaoAntesDaDataDeSolicitacao(): boolean {
    if (
      !this.valueForm.dataAvisoPrevio ||
      !this.valueForm.nCausaDemissao ||
      !this.colaboradorSelecionado
    )
      return false;

    const causa = Number(this.valueForm?.nCausaDemissao);
    if (causa == 2 || causa == 27) {
      const data = (
        new Date(
          this.valueForm.dataAvisoPrevio.setDate(
            this.valueForm.dataAvisoPrevio.getDate() +
              (Number(this.colaboradorSelecionado.NDiasAcrescidos) + 29)
          )
        ) as unknown as Date
      ).getTime();
      return (
        data >=
          this.stringParaData(
            this.colaboradorSelecionado?.DDataInicioBase
          ).getTime() &&
        data <=
          this.stringParaData(
            this.colaboradorSelecionado?.DDataFimBase
          ).getTime()
      );
    }
    return false;
  }

  emitirCausaDemissao(causa: number): void {
    this.causaDemissaoSelecionada.emit(causa);
    this.obrigatoriedadeDataAvisoPrevioPelaCausa(causa);
    this.obrigatoriedadeDataDesligamento();
  }

  obrigatoriedadeDataAvisoPrevioPelaCausa(causa: number): void {
    if (causa == 4)
      this.formDadosDesligamento
        .get('dataAvisoPrevio')
        .setValidators(Validators.required);
    else this.formDadosDesligamento.get('dataAvisoPrevio').clearValidators();
  }

  obrigatoriedadeDataDesligamento(): void {
    const causa = Number(this.valueForm?.nCausaDemissao);
    this.validacaoJuridicoCausa1();
    if ([2, 4, 27, 28].includes(causa))
      this.dataDesligamentoCausaComAvisoPrevio();
    else if (causa == 12) this.dataDesligamentoCausaFimContrato();
    else if (causa == 26) this.dataDesligamentoCausa26();
    else if ([13, 14].includes(causa))
      this.dataDesligamentoCausaFimContratoEstagio();
    else if ([1, 8, 9, 10, 11].includes(causa)) this.dataDesligamentoAberto();
    this.dataDemissaoPreenchida();
  }

  dataDesligamentoCausaComAvisoPrevio(): void {
    this.formDadosDesligamento.get('dataDemissao').disable();

    if (
      (this.valueForm?.nAvisoPrevio == 2 ||
        this.valueForm?.nAvisoPrevio == 3) &&
      this.valueForm?.dataAvisoPrevio
    ) {
      this.formDadosDesligamento
        .get('dataDemissao')
        .setValue(this.valueForm?.dataAvisoPrevio);
    } else if (
      this.valueForm?.nAvisoPrevio == 1 &&
      this.valueForm?.dataAvisoPrevio
    ) {
      const data = new Date(this.valueForm?.dataAvisoPrevio);
      if (isValid(data))
        this.formDadosDesligamento
          .get('dataDemissao')
          .setValue(data.setDate(data.getDate() + 29));
    }
  }

  dataDesligamentoCausaFimContrato(): void {
    this.formDadosDesligamento.get('dataDemissao').disable();
    this.formDadosDesligamento
      .get('dataDemissao')
      .setValue(this.stringParaData(this.solicitante?.DDataTermino));
  }

  dataDesligamentoCausa26(): void {
    if (this.solicitante?.AEhGestor != 'S' && this.solicitante?.AEhRhu != 'S')
      this.dataDesligamentoCausaFimContratoEstagio();
    else this.dataDesligamentoAberto();
  }

  dataDesligamentoCausaFimContratoEstagio(): void {
    if (
      this.valueForm?.dataDemissao >
        this.stringParaData(this.solicitante?.DDataTermino) ||
      this.valueForm?.dataDemissao < new Date()
    )
      this.formDadosDesligamento.get('dataDemissao').setValue(null);
    this.formDadosDesligamento.get('dataDemissao').enable();
    this.dataDesligamentoComponent.clearValue();
    this.dataDesligamentoComponent.setDataLimite(
      this.stringParaData(this.solicitante?.DDataTermino)
    );
  }

  dataDesligamentoAberto(): void {
    this.formDadosDesligamento.get('dataDemissao').enable();
    this.dataDesligamentoComponent.setDataLimite(null);
  }

  validacaoJuridicoCausa1(): void {
    if (this.valueForm?.nCausaDemissao == 1)
      this.formDadosDesligamento
        .get('validacaoJuridico')
        .setValidators(Validators.required);
    else this.formDadosDesligamento.get('validacaoJuridico').clearValidators();
  }

  formataData(data: Date): string {
    return format(data, 'dd/MM/yyyy');
  }

  stringParaData(data: string): Date {
    return new Date(
      data.split('/', 3)[1] +
        '-' +
        data.split('/', 3)[0] +
        '-' +
        data.split('/', 3)[2]
    );
  }

  dataHorasZeradas(data: Date): Date {
    data.setHours(0, 0, 0, 0);
    return data;
  }
}
