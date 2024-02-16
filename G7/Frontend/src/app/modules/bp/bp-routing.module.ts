import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BpComponent } from './bp.component';

const routes: Routes = [
  {
    path: '',
    component: BpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BpRoutingModule {}
