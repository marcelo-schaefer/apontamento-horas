import { NgModule } from '@angular/core';
import { BpComponent } from './bp.component';
import { BpRoutingModule } from './bp-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [BpComponent],
  imports: [BpRoutingModule, SharedModule],
})
export class BpModule {}
