import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestorImediatoComponent } from './gestor-imediato.component';

const routes: Routes = [
  {
    path: '',
    component: GestorImediatoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorImediatoRoutingModule {}
