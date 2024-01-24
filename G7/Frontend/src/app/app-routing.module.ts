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
