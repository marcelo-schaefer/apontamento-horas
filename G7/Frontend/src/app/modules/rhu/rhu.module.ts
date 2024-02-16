import { NgModule } from '@angular/core';
import { RhuComponent } from './rhu.component';
import { RhuRoutingModule } from './rhu-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RhuComponent],
  imports: [RhuRoutingModule, SharedModule],
})
export class RhuModule {}
