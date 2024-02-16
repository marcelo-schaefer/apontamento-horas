import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RhuComponent } from './rhu.component';

const routes: Routes = [
  {
    path: '',
    component: RhuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RhuRoutingModule {}
