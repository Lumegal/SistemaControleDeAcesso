import { IEpi } from "./almoxarifado/epi";
import { ISuprimentos } from "./almoxarifado/suprimentos";

export interface IItens {
    epis: IEpi[]
    suprimentos: ISuprimentos[]
}