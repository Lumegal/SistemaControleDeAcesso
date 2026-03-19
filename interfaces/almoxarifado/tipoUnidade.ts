import { IEpi } from "./epi";
import { ISuprimento } from "./suprimentos";

export interface ITipoUnidade {
  id: number;
  tipo: string;
  epis?: IEpi[];
  suprimentos?: ISuprimento[];
}
