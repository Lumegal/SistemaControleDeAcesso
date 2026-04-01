import { IItem } from "./item";

export interface IMovimentacaoItem {
  itemId: number;
  quantidade: number;
}

export interface IEntradaSaida {
  id: number;
  quantidade: number;
  data: Date;
  item: IItem;
}
