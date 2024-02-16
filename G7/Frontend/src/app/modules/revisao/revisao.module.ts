import { NgModule } from '@angular/core';
import { RevisaoComponent } from './revisao.component';
import { RevisaoRoutingModule } from './revisao-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RevisaoComponent],
  imports: [RevisaoRoutingModule, SharedModule],
})
export class RevisaoModule {}
