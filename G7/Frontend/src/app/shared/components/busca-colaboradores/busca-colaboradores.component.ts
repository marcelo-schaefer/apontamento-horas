import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, from, of, Observable } from 'rxjs';
import {
  debounceTime,
  filter,
  distinctUntilChanged,
  switchMap,
  take,
} from 'rxjs/operators';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import {
  Colaborador,
  RetornoColaboradores,
} from 'src/app/services/colaborador/models/colaboradores.model';

@Component({
  selector: 'app-busca-colaboradores',
  templateUrl: './busca-colaboradores.component.html',
  styleUrls: ['./busca-colaboradores.component.css'],
})
export class BuscaColaboradoresComponent implements OnInit {
  @Output()
  colaboradorSelecionado: EventEmitter<Colaborador> = new EventEmitter<Colaborador>();

  formColaborador: FormGroup = this.fb.group({
    colaboradorSelecionado: [
      { value: '', disabled: false },
      Validators.required,
    ],
    colaborador: { value: '', disabled: false },
  });

  constructor(
    private fb: FormBuilder,
    private wfService: WorkflowService,
    private colaboradoresService: ColaboradorService
  ) {}

  solicitante: Colaborador;
  tipoServicoInicio: boolean;
  colaboradores: Colaborador[] = [];
  isColaboradoresLoading = false;
  search = '';
  top = 10;
  skip = 0;
  isEndColaborador = false;
  searchChange$ = new BehaviorSubject('');

  ngOnInit(): void {
    this.buildForm();
    this.searchChange$
      .asObservable()
      .pipe(
        debounceTime(500),
        filter((query) => query.length >= 2 || query.length === 0),
        distinctUntilChanged(),
        switchMap((query) =>
          query
            ? from(this.searchLoadColaboradores(query))
            : from(of({ colaboradores: this.colaboradores }))
        )
      )
      .subscribe((colaboradores: RetornoColaboradores) => {
        if (colaboradores?.outputData?.colaboradores) {
          if (!Array.isArray(colaboradores.outputData.colaboradores))
            colaboradores.outputData.colaboradores = [
              colaboradores.outputData.colaboradores,
            ];
          this.colaboradores = colaboradores.outputData.colaboradores;
        }
        this.isColaboradoresLoading = false;
      });
  }

  buildForm(): void {
    this.formColaborador = this.fb.group({
      colaboradorSelecionado: [
        { value: '', disabled: false },
        Validators.required,
      ],
      colaborador: { value: '', disabled: false },
    });
  }

  desabilitarFormulario(): void {
    this.formColaborador.disable();
  }

  onSearch(search: string): void {
    if (search) this.searchChange$.next(search);
  }

  searchLoadColaboradores(search: string): Observable<RetornoColaboradores> {
    this.isColaboradoresLoading = true;
    this.cleanSelect();
    this.search = search;
    return this.loadColaboradores();
  }

  cleanSelect(): void {
    this.colaboradores = [];
    this.top = 10;
    this.skip = 0;
    this.isEndColaborador = false;
  }

  onScrollToBottom(): void {
    this.isColaboradoresLoading = true;
    this.loadColaboradores()
      .pipe(take(1))
      .subscribe((colaboradores) => {
        this.isEndColaborador =
          colaboradores &&
          colaboradores.outputData.colaboradores.length < this.top;

        this.colaboradores = this.colaboradores.concat(
          colaboradores.outputData.colaboradores
        );
        this.isColaboradoresLoading = false;
      });
  }

  preencherSolicitante(solicitante: Colaborador): void {
    this.solicitante = solicitante;
  }

  loadColaboradores(): Observable<RetornoColaboradores> {
    const { codigo, texto } = this.colaboradoresService.criarBusca(this.search);

    if (!this.isEndColaborador) {
      const search = {
        top: this.top,
        skip: this.skip,
        query: texto || codigo.toString(),
        aUsuarioSolicitante: this.wfService.getUser().username,
        aEhGestor: this.solicitante.AEhGestor,
      };

      const colaboradoreses =
        this.colaboradoresService.buscaColaboradores(search);

      this.skip += this.top;
      return colaboradoreses;
    } else this.isColaboradoresLoading = false;
  }

  selectColaborador(colaborador: Colaborador): void {
    this.colaboradorSelecionado.emit(colaborador);
  }

  retornarValorFormulario(): Colaborador {
    return this.formColaborador.get('colaboradorSelecionado')
      .value as Colaborador;
  }

  compareColaborador(c1: Colaborador, c2: Colaborador): boolean {
    return c1 && c2
      ? c1.NMatricula === c2.NMatricula &&
          c1.NTipoColaborador === c2.NTipoColaborador &&
          c1.NCodigoEmpresa === c2.NCodigoEmpresa
      : c1 === c2;
  }

  opcoesIniciais(): void {
    if (this.colaboradores.length < 1) {
      this.isColaboradoresLoading = true;
      this.loadColaboradores().subscribe(
        (retorno: RetornoColaboradores) => {
          if (retorno.outputData.colaboradores) {
            this.colaboradores = this.colaboradores.concat(
              retorno.outputData.colaboradores
            );
          }
          this.isColaboradoresLoading = false;
        },
        (error) => {
          console.error(error);
          this.isColaboradoresLoading = false;
        }
      );
    }
  }

  validarForm(): boolean {
    for (const i of Object.keys(this.formColaborador.controls)) {
      this.formColaborador.controls[i].markAsDirty();
      this.formColaborador.controls[i].updateValueAndValidity();
    }
    return this.formColaborador.valid;
  }

  desabilitarForm(): void {
    this.formColaborador.get('colaboradorSelecionado').disable();
  }

  preencherColaborador(colaborador: Colaborador): void {
    this.colaboradores = this.colaboradores.filter(
      (colab) =>
        colab.NMatricula == colaborador.NMatricula &&
        colab.NCodigoEmpresa == colaborador.NCodigoEmpresa &&
        colab.NTipoColaborador == colaborador.NTipoColaborador
    );
    this.colaboradores.splice(0, 0, colaborador);

    this.formColaborador.get('colaboradorSelecionado').setValue(colaborador);
  }
}
