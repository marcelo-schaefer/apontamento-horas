import { DetalhesRoutingModule } from './detalhes-routing.modules';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { DetalhesComponent } from './detalhes.component';

@NgModule({
  imports: [DetalhesRoutingModule, SharedModule],
  declarations: [DetalhesComponent],
})
export class DetalhesModule {}
