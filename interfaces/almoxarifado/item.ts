import { IFornecedor } from "./fornecedor";
import { ITipoItem } from "./tipoItem";
import { ITipoUnidade } from "./tipoUnidade";

export interface IItem {
  id: string;
  nome: string;
  descricao?: string;
  certificadoAprovacao?: string;
  quantidade: number;
  quantidadeParaAviso: number;
  tipoUnidade: ITipoUnidade;
  fornecedores: IFornecedor[];
  preco?: string;
  ipi?: number;
  tipoItem: ITipoItem;
}

export interface ICriarItem {
  nome: string;
  descricao?: string;
  certificadoAprovacao?: string;
  quantidade: number;
  quantidadeParaAviso: number;
  tipoUnidadeId: number;
  fornecedores?: number[];
  preco?: string;
  ipi?: number;
  tipoItem: ITipoItem;
}
