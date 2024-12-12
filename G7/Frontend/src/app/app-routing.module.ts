import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/detalhes',
    pathMatch: 'full',
  },
  {
    path: 'solicitacao',
    loadChildren: () =>
      import('./modules/solicitacao/solicitacao.module').then(
        (m) => m.SolicitacaoModule
      ),
    pathMatch: 'full',
  },
  {
    path: 'revisao',
    loadChildren: () =>
      import('./modules/revisao/revisao.module').then((m) => m.RevisaoModule),
    pathMatch: 'full',
  },
  {
    path: 'gestorImediato',
    loadChildren: () =>
      import('./modules/gestor-imediato/gestor-imediato.module').then(
        (m) => m.GestorImediatoModule
      ),
    pathMatch: 'full',
  },
  {
    path: 'rhu',
    loadChildren: () =>
      import('./modules/rhu/rhu.module').then((m) => m.RhuModule),
    pathMatch: 'full',
  },
  {
    path: 'bp',
    loadChildren: () =>
      import('./modules/bp/bp.module').then((m) => m.BpModule),
    pathMatch: 'full',
  },
  {
    path: 'gerente-regional',
    loadChildren: () =>
      import('./modules/gerencia-regional/gerencia-regional.module').then(
        (m) => m.GerenciaRegionalModule
      ),
    pathMatch: 'full',
  },

  {
    path: 'detalhes',
    loadChildren: () =>
      import('./modules/detalhes/detalhes.module').then(
        (m) => m.DetalhesModule
      ),
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // /#/solicitcao
  exports: [RouterModule],
})
export class AppRoutingModule {}
