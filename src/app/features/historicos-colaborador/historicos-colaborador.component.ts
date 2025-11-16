import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { finalize, lastValueFrom } from 'rxjs';

import { CalendarModule } from 'primeng/calendar';

import { InformacoesColaboradorService } from './services/informacoes-colaborador.service';
import {
  BuscaColaborador,
  Colaborador,
} from './services/models/colaborador.model';

import { InformacoesColaboradorComponent } from './components/informacoes-colaborador/informacoes-colaborador.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { ApontamentoHorasComponent } from './components/apontamento-horas/apontamento-horas.component';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import {
  ApontamentosPersistencia,
  HorasAdicionaisPersistencia,
  Persistencia,
} from './services/models/persistencia';
import { Apontamento } from './services/models/apontamento';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BuscaColaboradoresComponent } from './components/busca-colaboradores/busca-colaboradores.component';

@Component({
  selector: 'app-historicos-colaborador',
  standalone: true,
  imports: [
    FormsModule,
    InformacoesColaboradorComponent,
    ApontamentoHorasComponent,
    BuscaColaboradoresComponent,
    LoadingComponent,
    CalendarModule,
    ToastModule,
    ProgressSpinnerModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './historicos-colaborador.component.html',
  styleUrl: './historicos-colaborador.component.css',
})
export class HistoricosColaboradorComponent implements OnInit {
  @ViewChild(ApontamentoHorasComponent, { static: true })
  apontamentoHorasComponent: ApontamentoHorasComponent | undefined;

  @ViewChild(BuscaColaboradoresComponent, { static: true })
  buscaColaboradoresComponent: BuscaColaboradoresComponent | undefined;

  private informacoesColaboradorService = inject(InformacoesColaboradorService);

  protected informacoesColaborador = signal<Colaborador | undefined>(undefined);
  carregandoInformacoes = signal(false);

  public dataTeste = signal<Date | null>(null);
  solicitante!: Colaborador;
  colaboradorSelecionado!: Colaborador;

  constructor(private messageService: MessageService) {}

  async ngOnInit(): Promise<void> {
    await this.inicializaComponente();
  }

  async inicializaComponente(): Promise<void> {
    this.carregarTela(true);
    await this.obterInformacoesColaborador();
    //this.solicitante = this.criarColaborador();
    this.tratarDadosSolicitante();
    this.informacoesColaborador.set(this.solicitante);
    this.carregarTela(false);
  }

  carregarTela(carregar: boolean): void {
    this.carregandoInformacoes.set(carregar);
  }

  desabilitarTela(desabilitar: boolean): void {
    this.apontamentoHorasComponent?.desabilitarForm(desabilitar);
    this.buscaColaboradoresComponent?.desabilitarFormulario(desabilitar);
  }

  tratarDadosSolicitante(): void {
    if (this.solicitante) {
      if (!Array.isArray(this.solicitante?.datasApontamento))
        this.solicitante.datasApontamento = this.solicitante.datasApontamento
          ? [this.solicitante.datasApontamento]
          : [];

      if (!Array.isArray(this.solicitante?.projetos))
        this.solicitante.projetos = this.solicitante.projetos
          ? [this.solicitante.projetos]
          : [];

      if (!Array.isArray(this.solicitante?.limites))
        this.solicitante.limites = this.solicitante.limites
          ? [this.solicitante.limites]
          : [];

      this.solicitante.datasApontamento.forEach((data) => {
        if (!Array.isArray(data.apontamentos))
          data.apontamentos = data.apontamentos ? [data.apontamentos] : [];
      });

      if (this.solicitante.AEhGestor == 'S') {
        this.buscaColaboradoresComponent?.opcoesIniciais();
      } else {
        this.apontamentoHorasComponent?.preencherColaborador(this.solicitante);
      }
    }
  }

  notificarErro(mensagem: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
    });
  }
  notificarSucesso(mensagem: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: mensagem,
    });
  }

  async enviarSolicitacao(): Promise<void> {
    this.carregarTela(true);
    this.desabilitarTela(true);
    await this.gravarEnvio();
    this.desabilitarTela(false);
    this.carregarTela(false);
  }

  async obterInformacoesColaborador(): Promise<void> {
    await lastValueFrom(
      this.informacoesColaboradorService.obterInformacoesColaborador()
    ).then(
      (data) => {
        if (data.outputData.message || data.outputData.ARetorno != 'OK') {
          this.notificarErro(
            'Erro ao identificar o solicitante, ' +
              (data.outputData?.message || data.outputData?.ARetorno)
          );
          this.desabilitarTela(true);
        } else {
          this.solicitante = data.outputData;
        }
      },
      () => {
        this.desabilitarTela(true);
        this.notificarErro(
          'Erro ao identificar o solicitante, tente mais tarde ou contate o administrador'
        );
      }
    );
  }

  async receberColaboradorSelecionado(colaborador: Colaborador): Promise<void> {
    this.colaboradorSelecionado = colaborador;
    this.carregarTela(true);
    this.desabilitarTela(true);
    await this.obterInformacoesColaboradorSelecionado(
      this.montaCorpoBuscaColaborador()
    );
    this.apontamentoHorasComponent?.preencherColaborador(
      this.colaboradorSelecionado
    );
    this.carregarTela(false);
    this.desabilitarTela(false);
  }

  montaCorpoBuscaColaborador(): BuscaColaborador {
    return {
      nCodigoEmpresa: Number(this.colaboradorSelecionado.NCodigoEmpresa),
      nTipoColaborador: Number(this.colaboradorSelecionado.NTipoColaborador),
      nMatricula: Number(this.colaboradorSelecionado.NMatricula),
    };
  }

  async obterInformacoesColaboradorSelecionado(
    body: BuscaColaborador
  ): Promise<void> {
    await lastValueFrom(
      this.informacoesColaboradorService.obterInformacoesColaboradorSelecionado(
        body
      )
    ).then(
      (data) => {
        if (data.outputData.message || data.outputData.ARetorno != 'OK') {
          this.notificarErro(
            'Erro ao buscar informações do colaborador selecionado, ' +
              (data.outputData?.message || data.outputData?.ARetorno)
          );
          this.desabilitarTela(true);
        } else {
          this.colaboradorSelecionado = data.outputData;
        }
      },
      () => {
        this.desabilitarTela(false);
        this.notificarErro(
          'Erro ao buscar informações do colaborador selecionado, tente mais tarde ou contate o administrador'
        );
      }
    );
  }

  async gravarHorasAdicionais(
    body: HorasAdicionaisPersistencia
  ): Promise<void> {
    this.carregarTela(true);
    await lastValueFrom(
      this.informacoesColaboradorService.gravarHorasAdicionais(body)
    ).then(
      (data) => {
        if (data.outputData.message || data.outputData.ARetorno != 'OK') {
          this.notificarErro(
            'Erro ao gravar as horas adicionais, ' +
              (data.outputData?.message || data.outputData?.ARetorno)
          );
          this.carregarTela(false);
          this.desabilitarTela(false);
        } else {
          this.notificarSucesso('Gravado com sucesso!');
          this.desabilitarTela(false);
          this.carregarTela(false);
        }
      },
      () => {
        this.notificarErro(
          'Erro ao gravar as horas adicionais, tente mais tarde ou contate o administrador'
        );
        this.carregarTela(false);
        this.desabilitarTela(false);
      }
    );
  }

  async gravarEnvio(): Promise<void> {
    await lastValueFrom(
      this.informacoesColaboradorService.gravarEnvio(this.montaCorpoEnvio())
    ).then(
      (data) => {
        if (data.outputData.message || data.outputData.ARetorno != 'OK') {
          this.notificarErro(
            'Erro ao gravar os apontramentos, ' +
              (data.outputData?.message || data.outputData?.ARetorno)
          );
          this.carregarTela(false);
          this.desabilitarTela(false);
        } else {
          this.notificarSucesso('Gravado com sucesso!');
          this.inicializaComponente();
        }
      },
      () => {
        this.notificarErro(
          'Erro ao gravar os apontramentos, tente mais tarde ou contate o administrador'
        );
        this.carregandoInformacoes.set(false);
      }
    );
  }

  montaCorpoEnvio(): Persistencia {
    const colaborador =
      this.solicitante.AEhGestor == 'S'
        ? this.colaboradorSelecionado
        : this.solicitante;
    return {
      nEmpresa: Number(colaborador.NCodigoEmpresa),
      nTipoColaborador: Number(colaborador.NTipoColaborador),
      nMatricula: Number(colaborador.NMatricula),
      dData: this.apontamentoHorasComponent?.data.DData,
      apontamentos: this.apontamentoHorasComponent?.listaApontamentosAtual
        .filter((f) => f.incluido || f.excluido)
        .map((apontamento) => {
          return {
            nCodigoProjeto: Number(apontamento.NCodigoProjeto),
            nQuantidade: Number(apontamento.NQuantidade),
            aObservacao: apontamento.AObservacao,
            aTipo: apontamento.excluido ? 'E' : 'I',
          } as ApontamentosPersistencia;
        })
        .concat(
          this.retornaApontamentosAlterados()
        ) as ApontamentosPersistencia[],
    };
  }

  retornaApontamentosAlterados(): ApontamentosPersistencia[] {
    let apontamentos: ApontamentosPersistencia[] = [];
    this.apontamentoHorasComponent?.listaApontamentosAtual.forEach(
      (apontamento: Apontamento, index: number) => {
        if (apontamento.alterado)
          apontamentos.push({
            nCodigoProjeto: Number(
              this.apontamentoHorasComponent?.data.apontamentos[index]
                .NCodigoProjeto
            ),
            nQuantidade: Number(
              this.apontamentoHorasComponent?.data.apontamentos[index]
                .NQuantidade
            ),
            aTipo: 'E',
            aObservacao:
              this.apontamentoHorasComponent?.data.apontamentos[index]
                .aObservacao,
          });
      }
    );

    this.apontamentoHorasComponent?.listaApontamentosAtual.forEach(
      (apontamento: Apontamento) => {
        if (apontamento.alterado)
          apontamentos.push({
            nCodigoProjeto: Number(apontamento.NCodigoProjeto),
            nQuantidade: Number(apontamento.NQuantidade),
            aTipo: 'I',
            aObservacao: apontamento.AObservacao,
          });
      }
    );

    return apontamentos;
  }

  criarColaborador(): Colaborador {
    return {
      NCodigoEmpresa: '12345',
      ANomeEmpresa: 'Empresa Exemplo LTDA',
      NTipoColaborador: '1',
      ADescricaoTipoColaborador: 'Empregado',
      NMatricula: '123456',
      ANome: 'João da Silva',
      ARetorno: 'Sucesso',
      datasApontamento: [
        {
          DData: '20/12/2024',
          AAfastado: 'N',
          ABatidasPonto: '08:00 - 12:00, 13:00 - 17:00',
          NQuantidadeHorasPrevistas: '480',
          NQuantidadeBatidas: '4',
          apontamentos: [
            {
              NCodigoProjeto: '1',
              NQuantidade: '360',
            },
            {
              NCodigoProjeto: '2',
              NQuantidade: '60',
            },
          ],
        },
        {
          DData: '19/12/2024',
          AAfastado: 'S',
          ABatidasPonto: 'Não Apontado',
          NQuantidadeHorasPrevistas: '480',
          apontamentos: [],
        },
        {
          DData: '18/12/2024',
          AAfastado: 'N',
          ABatidasPonto: '07:00 - 12:12 - 13:30',
          NQuantidadeHorasPrevistas: '480',
          NQuantidadeBatidas: '3',
          apontamentos: [
            {
              NCodigoProjeto: '1',
              NQuantidade: '60',
            },
            {
              NCodigoProjeto: '2',
              NQuantidade: '120',
            },
          ],
        },
      ],
      projetos: [
        {
          NCodigoProjeto: '1',
          ADescricaoProjeto: 'Desenvolvimento de Sistema',
          nQuantidade: '10',
        },
        {
          NCodigoProjeto: '2',
          ADescricaoProjeto: 'Suporte Técnico',
          nQuantidade: '8',
        },
      ],
    } as unknown as Colaborador;
  }
}
