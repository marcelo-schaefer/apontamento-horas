import { ObservacaoComponent } from './components/observacao/observacao.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { DadosSolicitanteComponent } from './components/dados-solicitante/dados-solicitante.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TermoCienciaComponent } from './components/termo-ciencia/termo-ciencia.component';
import { TipoSolicitacaoComponent } from './components/tipo-solicitacao/tipo-solicitacao.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DadosSolicitacaoComponent } from './components/dados-solicitacao/dados-solicitacao.component';
import { DatePickerCustomComponent } from './components/date-picker-custom/date-picker-custom.component';

const NG_ZORRO_MODULES = [
  NzButtonModule,
  NzCardModule,
  NzCheckboxModule,
  NzDatePickerModule,
  NzDividerModule,
  NzEmptyModule,
  NzFormModule,
  NzGridModule,
  NzIconModule,
  NzInputNumberModule,
  NzInputModule,
  NzListModule,
  NzNotificationModule,
  NzRadioModule,
  NzSelectModule,
  NzSwitchModule,
  NzUploadModule,
  NzSpinModule,
  NzModalModule,
  NzAlertModule,
  NgxMaskModule,
  NzTimePickerModule,
  NzTableModule,
  NzToolTipModule,
  NzTabsModule,
];

const COMPONENTS = [
  ObservacaoComponent,
  DadosSolicitanteComponent,
  TermoCienciaComponent,
  TipoSolicitacaoComponent,
  DadosSolicitacaoComponent,
  DatePickerCustomComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxMaskModule.forRoot(),
    ...NG_ZORRO_MODULES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NgxCurrencyModule,
    ...NG_ZORRO_MODULES,
    ...COMPONENTS,
  ],
})
export class SharedModule {}
