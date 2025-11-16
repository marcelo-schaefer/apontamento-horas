import { DataApontamento } from './../../services/models/data-apontamento';
import { Colaborador } from './../../services/models/colaborador.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Apontamento } from '../../services/models/apontamento';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Projeto } from '../../services/models/projeto.model';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { HorasAdicionaisPersistencia } from '../../services/models/persistencia';

@Component({
  selector: 'app-apontamento-horas',
  standalone: true,
  imports: [
    CardModule,
    DropdownModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputSwitchModule,
    CalendarModule,
    MessagesModule,
    ToastModule,
    RippleModule,
    TooltipModule,
    DialogModule,
  ],
  providers: [MessageService],
  templateUrl: './apontamento-horas.component.html',
  styleUrls: ['./apontamento-horas.component.css'],
})
export class ApontamentoHorasComponent implements OnInit {
  @Output()
  enviarSolicitacao: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  enviarHorasAdicionais: EventEmitter<HorasAdicionaisPersistencia> =
    new EventEmitter<HorasAdicionaisPersistencia>();

  public informacoesColaborador = input<Colaborador | undefined>(undefined);
  formApontamento!: FormGroup;
  colaborador!: Colaborador;
  listaApontamentosAtual: Apontamento[] = [];
  data!: any;
  desabilitar: boolean = false;
  apresentarFiltroData: boolean = false;
  projetoSelecionado: string = '';
  horasAdicionais: Date = new Date();
  mensagemErroSomatoria: Message[] = [
    {
      severity: 'error',
      detail:
        'A somatória de apontamentos não pode ultrapassar a quantidade de horas previstas para esse dia.',
    },
  ];
  mensagemErroAfastamento: Message[] = [
    {
      severity: 'error',
      detail:
        'O colaborador estava afastado nesse dia, por tanto, não poderá apontar nele.',
    },
  ];
  mensagemErroMesmoProjeto: Message[] = [
    {
      severity: 'error',
      detail:
        'Não é possivel selecionar o mesmo projeto mais de uma vez, remova ou faça a alteração.',
    },
  ];
  mensagemErroMarcacoesInpares: Message[] = [
    {
      severity: 'error',
      detail:
        'Marcações impares, favor revisar as marcações de ponto neste dia.',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formApontamento = this.fb.group({
      periodo: [{ value: '', disabled: false }, Validators.required],
      dataAcerto: [{ value: '', disabled: false }, Validators.required],
      apontamentos: this.fb.array([]),
    });
  }

  enviar(): void {
    if (this.validarEnvio()) this.enviarSolicitacao.emit(true);
  }

  validarEnvio(): boolean {
    if (!this.data) {
      this.notificar('É obriatorio informar a data do apontamento');
      return false;
    }

    if (this.listaApontamentosAtual.length < 1) {
      this.notificar('É obriatorio adicionar ao menos um apontamento');
      return false;
    }

    this.validarAlterqacaoNoApontamento();
    if (
      this.listaApontamentosAtual.filter(
        (f) => f.incluido || f.alterado || f.excluido
      ).length < 1
    ) {
      this.notificar('É obriatorio ter alguma alteração nos apontamentos');
      return false;
    }

    if (
      this.listaApontamentosAtual.filter(
        (f) => !f.NCodigoProjeto || f.NQuantidade == '0'
      ).length > 0
    ) {
      this.notificar(
        'As informações de projetos e quantidade de horas devem ser preenchidas e diferentes de zero'
      );
      return false;
    }

    if (
      this.colaborador.AValidaTotalHoras != 'N' &&
      this.retornaHorasApontadas() !== '00:00' &&
      this.retornaHorasApontadas() !== this.retornaHorasTrabalhadas()
    ) {
      this.notificar(
        'O total de horas apontadas deve ser igual ao total da jornada realizada no dia'
      );
      return false;
    }

    return (
      !this.validarDataAfastado() &&
      !this.validarProjetoRepetido() &&
      !this.validarmarcacoesImpares()
    );
  }

  notificar(mensagem: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
    });
  }

  limparFormulario(): void {
    this.data = null;
    this.listaApontamentosAtual = [];
  }

  preencherColaborador(colaborador: Colaborador): void {
    this.limparFormulario();
    this.colaborador = colaborador;

    if (this.colaborador?.projetos?.length > 0)
      this.colaborador.projetos.forEach((projeto) => {
        projeto.label = `${projeto.NCodigoProjeto} - ${projeto.ADescricaoProjeto}`;
      });
  }

  labelProjeto(codigoProjeto: string): string {
    return this.colaborador?.projetos?.length > 0
      ? this.colaborador?.projetos.find(
          (f) => f.NCodigoProjeto == codigoProjeto
        )?.label || ''
      : 'Não existem projetos para serem selecionados';
  }

  selecionarData(data: any): void {
    this.formApontamento?.get('dataAcerto')?.setValue(data.value);
    this.data = data.value;
    this.listaApontamentosAtual = JSON.parse(
      JSON.stringify(this.data?.apontamentos || [])
    );
    this.inicializacaoListaApontamentosAtual();
  }

  inicializacaoListaApontamentosAtual(): void {
    this.listaApontamentosAtual.forEach((apontamento) => {
      apontamento.alterado = false;
      apontamento.excluido = false;
      apontamento.quantidadeHoras = this.converteMinutosStringParaDate(
        Number(apontamento.NQuantidade)
      );
      apontamento.quantidadeFormatado = this.converteMinutosParaString(
        Number(apontamento.NQuantidade)
      );
    });
  }

  converteMinutosStringParaDate(minutos: number): Date {
    const data = new Date();
    if (minutos) {
      data.setHours(Math.floor(minutos / 60));
      data.setMinutes(minutos / 60 - Math.floor(minutos / 60));
    } else {
      data.setHours(0);
      data.setMinutes(0);
    }
    return data;
  }

  converteMinutosParaString(minutos: number): string {
    const negativo = minutos < 0;

    if (negativo) minutos = minutos * -1;
    let minutes = minutos % 60;
    let hours = Math.floor(minutos / 60);

    let horaFormatada =
      (hours > 9 ? hours.toString() : '0' + hours.toString()) +
      ':' +
      (minutes > 9 ? minutes.toString() : '0' + minutes.toString());

    horaFormatada = (negativo ? '- ' : '') + horaFormatada;

    return horaFormatada;
  }

  converteMinutos(data: Date): number {
    return data.getHours() * 60 + data.getMinutes();
  }

  adicioanrLinha(): void {
    this.listaApontamentosAtual.push({
      NCodigoProjeto: '',
      NQuantidade: '0',
      quantidadeHoras: this.converteMinutosStringParaDate(0),
      AObservacao: '',
      quantidadeFormatado: this.converteMinutosParaString(0),
      incluido: true,
    });
  }

  botaoExcluir(index: number): void {
    this.listaApontamentosAtual.splice(index, 1);
  }

  botaoExcluirExistente(index: number): void {
    this.listaApontamentosAtual[index].excluido =
      !this.listaApontamentosAtual[index].excluido;
  }

  atulizarFormatacaoQuantidadeHoras(index: number): void {
    this.listaApontamentosAtual[index].NQuantidade = this.converteMinutos(
      this.listaApontamentosAtual[index].quantidadeHoras
    ).toString();
    this.listaApontamentosAtual[index].quantidadeFormatado =
      this.converteMinutosParaString(
        Number(this.listaApontamentosAtual[index].NQuantidade)
      );
  }

  validarTotalHoras(): boolean {
    let totalHoras = 0;
    if (this.listaApontamentosAtual.length > 0) {
      this.listaApontamentosAtual
        .filter((f) => !f?.excluido)
        .forEach((apontamento) => {
          totalHoras += Number(apontamento?.NQuantidade || 0);
        });
    }
    return totalHoras > 600;
  }

  validarDataAfastado(): boolean {
    return this.data && this.data?.AAfastado == 'S';
  }

  validarmarcacoesImpares(): boolean {
    return this.data && Number(this.data?.NQuantidadeBatidas) % 2 !== 0;
  }

  validarProjetoRepetido(): boolean {
    const vistos: Set<string> = new Set();

    for (const apontamento of this.listaApontamentosAtual.filter(
      (f) => !f.excluido
    )) {
      if (
        apontamento.NCodigoProjeto &&
        vistos.has(apontamento.NCodigoProjeto)
      ) {
        return true;
      }
      vistos.add(apontamento.NCodigoProjeto);
    }

    return false;
  }

  validarAlterqacaoNoApontamento(): void {
    if (this.data.apontamentos)
      this.data.apontamentos.forEach(
        (apontamentoAntigo: Apontamento, index: number) => {
          const apontamentoNovo = this.listaApontamentosAtual[index];
          if (!apontamentoNovo.excluido) {
            this.listaApontamentosAtual[index].alterado =
              apontamentoAntigo.NCodigoProjeto !=
                apontamentoNovo.NCodigoProjeto ||
              apontamentoAntigo.NQuantidade != apontamentoNovo.NQuantidade ||
              apontamentoAntigo.AObservacao != apontamentoNovo.AObservacao;
          }
        }
      );
  }

  desabilitarForm(habilitar: boolean): void {
    this.desabilitar = habilitar;
  }

  retornaHorasApontadas(): string {
    return this.converteMinutosParaString(
      this.listaApontamentosAtual
        .filter((f) => !f.excluido)
        .reduce((total, apontamento) => {
          return total + Number(apontamento.NQuantidade || 0);
        }, 0)
    );
  }

  calculaPorcentaghemHorasApontadas(codigoProjeto: string): number {
    const totalPlanejado = Number(
      this.colaborador.projetos.find(
        (projeto) => projeto.NCodigoProjeto === codigoProjeto
      )?.NTotalHorasSaldo || 0
    );

    const totalApontado = this.calculaTotalHorasProjeto(codigoProjeto);
    const porcentagem = (totalApontado / totalPlanejado) * 100;
    return isNaN(porcentagem) ? 0 : porcentagem;
  }

  retornaSaldoHoras(codigoProjeto: string): string {
    if (!codigoProjeto) return '00:00';
    const totalPlanejado = Number(
      this.colaborador.projetos.find(
        (projeto) => projeto.NCodigoProjeto === codigoProjeto
      )?.NTotalHorasSaldo || 0
    );

    const totalApontado = this.calculaTotalHorasProjeto(codigoProjeto);
    return this.converteMinutosParaString(totalPlanejado - totalApontado);
  }

  calculaTotalHorasProjeto(codigoProjeto: string): number {
    if (!codigoProjeto) return 0;
    let total = 0;
    total = Number(
      this.colaborador.projetos.find(
        (projeto) => projeto.NCodigoProjeto === codigoProjeto
      )?.NTotalApontado || 0
    );

    this.listaApontamentosAtual
      .filter((f) => f.excluido && f.NCodigoProjeto === codigoProjeto)
      .forEach((item) => {
        total -= Number(item.NQuantidade || 0);
      });

    this.listaApontamentosAtual
      .filter((f) => f.incluido && f.NCodigoProjeto === codigoProjeto)
      .forEach((item) => {
        total += Number(item.NQuantidade || 0);
      });

    return total;
  }

  retornaTotalHorasProjeto(codigoProjeto: string): string {
    if (!codigoProjeto) return '00:00';
    return this.converteMinutosParaString(
      this.calculaTotalHorasProjeto(codigoProjeto)
    );
  }

  retornaMenorPorcentagem(): number {
    return (
      Math.min(...this.colaborador.limites.map((l) => Number(l.porcentagem))) ||
      100
    );
  }

  retornaMensagemInformandoLimite(codigoProjeto: string): string {
    const porcentagemAtual =
      this.calculaPorcentaghemHorasApontadas(codigoProjeto);
    let mensagem = '';
    this.colaborador.limites.forEach((limite) => {
      if (porcentagemAtual >= Number(limite.porcentagem)) {
        mensagem = `Atenção! Você atingiu mais de ${limite.porcentagem}% de horas apontadas para este projeto.`;
      }
    });
    return mensagem;
  }

  abrirSolicitarHorasAdicionais(codigoProjeto: string): void {
    this.projetoSelecionado = codigoProjeto;
    this.apresentarFiltroData = true;
    this.horasAdicionais.setHours(0, 0, 0, 0);
  }

  solicitarHorasAdicionais(): void {
    this.apresentarFiltroData = false;
    this.desabilitarForm(false);
    this.enviarHorasAdicionais.emit(this.montaCorpoHorasAdicionais());
  }

  montaCorpoHorasAdicionais(): HorasAdicionaisPersistencia {
    return {
      nEmpresa: Number(this.colaborador.NCodigoEmpresa),
      nTipoColaborador: Number(this.colaborador.NTipoColaborador),
      nMatricula: Number(this.colaborador.NMatricula),
      nCodigoProjeto: Number(this.projetoSelecionado),
      nQuantidade:
        this.horasAdicionais.getHours() * 60 +
        this.horasAdicionais.getMinutes(),
    };
  }

  retornaHorasTrabalhadas(): string {
    return this.data?.NQuantidadeBatidas
      ? this.converteMinutosParaString(
          this.calcularMinutosMarcacoes(this.data?.ABatidasPonto || '')
        )
      : '00:00';
  }

  calcularMinutosMarcacoes(marcacoes: string): number {
    if (!marcacoes) return 0;
    const horas = marcacoes.split('-').map((h) => h.trim());
    let totalMinutos = 0;

    for (let i = 0; i < horas.length - 1; i += 2) {
      const [h1, m1] = horas[i].split(':').map(Number);
      const [h2, m2] = horas[i + 1].split(':').map(Number);

      const inicio = h1 * 60 + m1;
      const fim = h2 * 60 + m2;

      totalMinutos += fim - inicio;
    }

    return totalMinutos;
  }
}
