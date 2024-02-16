import { NgModule } from '@angular/core';
import { GestorImediatoComponent } from './gestor-imediato.component';
import { GestorImediatoRoutingModule } from './gestor-imediato-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GestorImediatoComponent],
  imports: [GestorImediatoRoutingModule, SharedModule],
})
export class GestorImediatoModule {}
