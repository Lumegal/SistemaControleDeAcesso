import { IItem } from "./item";

export interface IMovimentacaoItem {
  id: string;
  quantidade: number;
}

export interface IEntradaSaida {
  id: number;
  quantidade: number;
  data: Date;
  item: IItem;
}
