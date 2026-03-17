import { ITipoUnidade } from "./tipoUnidade";

export interface ISuprimento {
  id: number;
  nome: string;
  descricao?: string;
  quantidade: number;
  quantidadeParaAviso: number;
  preco: number;
  ipi?: number;
  tipoUnidade: ITipoUnidade;
}
