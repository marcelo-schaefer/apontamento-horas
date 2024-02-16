import { SolicitacaoComponent } from './solicitacao.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { SolicitacaoRoutingModule } from './solicitacao-routing.module';

@NgModule({
  declarations: [SolicitacaoComponent],
  imports: [SolicitacaoRoutingModule, SharedModule],
})
export class SolicitacaoModule {}
