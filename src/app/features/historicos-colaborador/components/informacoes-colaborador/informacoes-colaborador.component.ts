import { Component, input } from '@angular/core';

import { CardModule } from 'primeng/card';
import { Colaborador } from '../../services/models/colaborador.model';

@Component({
  selector: 'app-informacoes-colaborador',
  standalone: true,
  imports: [CardModule],
  templateUrl: './informacoes-colaborador.component.html',
  styleUrl: './informacoes-colaborador.component.css',
})
export class InformacoesColaboradorComponent {
  public informacoesColaborador = input<Colaborador | undefined>(undefined);
}
