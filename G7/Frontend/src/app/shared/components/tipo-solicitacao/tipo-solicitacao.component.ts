import { Component, ViewChild } from '@angular/core';
import { Colaborador } from 'src/app/services/colaborador/models/colaboradores.model';
import { Dependente } from '../../model/dependente';
import { DadosSolicitacaoComponent } from '../dados-solicitacao/dados-solicitacao.component';
import { DadosSolicitacao } from '../../model/dados-solicitacao';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-tipo-solicitacao',
  templateUrl: './tipo-solicitacao.component.html',
  styleUrls: ['./tipo-solicitacao.component.scss'],
})
export class TipoSolicitacaoComponent {
  @ViewChild('DadosSolicitacaoComponentAdesao', { static: true })
  dadosSolicitacaoComponentAdesao: DadosSolicitacaoComponent;
  @ViewChild('DadosSolicitacaoComponentAlteracao', { static: true })
  dadosSolicitacaoComponentAlteracao: DadosSolicitacaoComponent;
  @ViewChild('DadosSolicitacaoComponentExclusao', { static: true })
  dadosSolicitacaoComponentExclusao: DadosSolicitacaoComponent;

  isLoading = false;
  desabilitarInclusao = false;
  desabilitarAlteracao = true;
  indexTipoSolicitacao = 0;

  solicitante: Colaborador;
  dependentes: Dependente[];

  constructor(private notification: NzNotificationService) {}

  identificaTipoSolicitacao(index: number): void {
    if (!this.desabilitarInclusao || !this.desabilitarAlteracao) {
      this.indexTipoSolicitacao = index;

      if (this.indexTipoSolicitacao == 0) this.prepararComponenteAdesao();
      else if (this.indexTipoSolicitacao == 1)
        this.prepararComponenteAlteracao();
      else this.prepararComponenteExclusao();
    }
  }

  loadingForm(loading: boolean): void {
    this.isLoading = loading;
  }

  preencherDadosColaborador(
    colaborador: Colaborador,
    dependentes: Dependente[]
  ): void {
    this.solicitante = colaborador;
    this.dependentes = dependentes;
    this.inicializarAbaCorreta();
    this.desabilitarTiposSolicitacao();
  }

  inicializarAbaCorreta(): void {
    if (this.solicitante.APossuiBeneficio == 'S') this.indexTipoSolicitacao = 1;
    else this.identificaTipoSolicitacao(0);
  }

  desabilitarTiposSolicitacao(): void {
    this.desabilitarInclusao = this.solicitante.APossuiBeneficio == 'S';
    this.desabilitarAlteracao = !this.desabilitarInclusao;
  }

  prepararComponenteAdesao(): void {
    this.dadosSolicitacaoComponentAdesao.definirTipoSolicitacao(
      this.indexTipoSolicitacao
    );
    this.dadosSolicitacaoComponentAdesao.preencherFormulario(this.solicitante);
    this.dadosSolicitacaoComponentAdesao.preencherDependentes(this.dependentes);
  }

  prepararComponenteAlteracao(): void {
    this.dadosSolicitacaoComponentAlteracao.definirTipoSolicitacao(
      this.indexTipoSolicitacao
    );
    this.dadosSolicitacaoComponentAlteracao.preencherFormulario(
      this.solicitante
    );
    this.dadosSolicitacaoComponentAlteracao.preencherDependentes(
      this.dependentes
    );
  }
  prepararComponenteExclusao(): void {
    this.dadosSolicitacaoComponentExclusao.preencherFormulario(
      this.solicitante
    );
    this.dadosSolicitacaoComponentExclusao.preencherDependentes(
      this.dependentes
    );
    this.dadosSolicitacaoComponentExclusao.definirTipoSolicitacao(
      this.indexTipoSolicitacao
    );
  }

  validarForm(): boolean {
    return this.indexTipoSolicitacao == 0
      ? this.dadosSolicitacaoComponentAdesao.validarForm()
      : this.indexTipoSolicitacao == 1
      ? this.dadosSolicitacaoComponentAlteracao.validarForm() &&
        this.validaModificacaoNaAlteracao()
      : true;
  }

  get value(): DadosSolicitacao {
    return this.indexTipoSolicitacao == 0
      ? this.dadosSolicitacaoComponentAdesao.value
      : this.indexTipoSolicitacao == 1
      ? this.dadosSolicitacaoComponentAlteracao.value
      : this.dadosSolicitacaoComponentExclusao.value;
  }

  retornaTipoSolicitacao(): string {
    return this.indexTipoSolicitacao == 0
      ? 'Adesão'
      : this.indexTipoSolicitacao == 1
      ? 'Alteração'
      : 'Suspensão-Exclusão';
  }

  preencherTipoSolicitacao(tipoSolicitacao: string): void {
    this.indexTipoSolicitacao =
      tipoSolicitacao == 'Alteração'
        ? 1
        : tipoSolicitacao == 'Suspensão-Exclusão'
        ? 2
        : 0;
  }

  preencherDadosSolicitacao(solicitacao: DadosSolicitacao): void {
    this.indexTipoSolicitacao == 0
      ? this.dadosSolicitacaoComponentAdesao.preencherFormularioCompleto(
          solicitacao
        )
      : this.indexTipoSolicitacao == 1
      ? this.dadosSolicitacaoComponentAlteracao.preencherFormularioCompleto(
          solicitacao
        )
      : this.dadosSolicitacaoComponentExclusao.preencherFormularioCompleto(
          solicitacao
        );
  }

  desabilitarForm(): void {
    this.desabilitarInclusao = true;
    this.desabilitarAlteracao = true;
    this.indexTipoSolicitacao == 0
      ? this.dadosSolicitacaoComponentAdesao.desabilitarForm()
      : this.indexTipoSolicitacao == 1
      ? this.dadosSolicitacaoComponentAlteracao.desabilitarForm()
      : this.dadosSolicitacaoComponentExclusao.desabilitarForm();
  }

  validaModificacaoNaAlteracao(): boolean {
    const chavesForm = Object.keys(
      this.dadosSolicitacaoComponentAlteracao.value
    );

    const dadosDaSolicitacaoSaoDiferentes = chavesForm.some((chave) => {
      if (
        !!this.solicitante[chave] &&
        !!this.dadosSolicitacaoComponentAlteracao.value[chave]
      )
        return (
          this.solicitante[chave] !==
          this.dadosSolicitacaoComponentAlteracao.value[chave]
        );
    });
    const dependnetesSelecionadosSaoDiferentes =
      this.dependentes.filter((f) => f.APossuiPrevidencia == 'S').length !=
        this.dadosSolicitacaoComponentAlteracao.value.dependentes.length ||
      this.dependentes.filter(
        (dependenteAntigo) =>
          dependenteAntigo.APossuiPrevidencia == 'S' &&
          !this.dadosSolicitacaoComponentAlteracao.value.dependentes
            .map((dependenteNovo) => dependenteNovo.NId)
            .includes(dependenteAntigo.NId)
      ).length > 0;

    if (
      !dadosDaSolicitacaoSaoDiferentes &&
      !dependnetesSelecionadosSaoDiferentes
    )
      this.notification.error(
        'Atenção',
        'É obrigatório conter alguma modificação nos dados da previdência ou dos dependentes para seguir uma alteração'
      );
    return (
      dadosDaSolicitacaoSaoDiferentes || dependnetesSelecionadosSaoDiferentes
    );
  }
}
