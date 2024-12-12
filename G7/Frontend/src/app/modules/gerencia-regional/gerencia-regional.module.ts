import { NgModule } from '@angular/core';
import { GerenciaRegionalComponent } from './gerencia-regional.component';
import { GerenciaRegionalRoutingModule } from './gerencia-regional-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GerenciaRegionalComponent],
  imports: [GerenciaRegionalRoutingModule, SharedModule],
})
export class GerenciaRegionalModule {}
