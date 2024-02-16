import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CscComponent } from './csc.component';

const routes: Routes = [
  {
    path: '',
    component: CscComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CscRoutingModule {}
