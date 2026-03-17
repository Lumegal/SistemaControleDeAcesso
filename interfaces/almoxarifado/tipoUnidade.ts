import { IEpi } from "./epi";
import { ISuprimentos } from "./suprimentos";

export interface ITipoUnidade {
  id: number;
  tipo: string;
  epis?: IEpi[];
  suprimentos?: ISuprimentos[];
}
