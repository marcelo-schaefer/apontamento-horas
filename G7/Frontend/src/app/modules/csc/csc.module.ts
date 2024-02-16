import { NgModule } from '@angular/core';
import { CscComponent } from './csc.component';
import { CscRoutingModule } from './csc-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CscComponent],
  imports: [CscRoutingModule, SharedModule],
})
export class CscModule {}
