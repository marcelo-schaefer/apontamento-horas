import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import(
        './features/historicos-colaborador/historicos-colaborador.component'
      ).then((c) => c.HistoricosColaboradorComponent),
  },
];
