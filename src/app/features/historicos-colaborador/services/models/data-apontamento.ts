import { Apontamento } from "./apontamento";

export interface DataApontamento {
  DData: string;
  AAfastado: string;
  ABatidasPonto?: string;
  NQuantidadeHorasPrevistas?: string;
  NQuantidadeBatidas?: string;
  apontamentos: Apontamento[];
}
