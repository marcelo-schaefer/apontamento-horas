import { NgModule } from '@angular/core';
import { RhComponent } from './rh.component';
import { RhRoutingModule } from './rh-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RhComponent],
  imports: [RhRoutingModule, SharedModule],
})
export class RhModule {}
