import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GerenciaRegionalComponent } from './gerencia-regional.component';

const routes: Routes = [
  {
    path: '',
    component: GerenciaRegionalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerenciaRegionalRoutingModule {}
