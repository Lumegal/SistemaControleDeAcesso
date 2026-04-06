import { IFornecedor, IFornecedorForm } from "./fornecedor";
import { ITipoItem } from "./tipoItem";
import { ITipoUnidade } from "./tipoUnidade";

export interface IItem {
  id: number;
  nome: string;
  descricao?: string;
  certificadoAprovacao?: string;
  quantidade: number;
  quantidadeParaAviso: number;
  tipoUnidade: ITipoUnidade;
  fornecedores: IFornecedor[];
  preco?: number;
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
  tipoItemId: number;
}

export interface INovoItemForm {
  nome: string;
  descricao?: string;
  certificadoAprovacao?: string;
  quantidade: string;
  quantidadeParaAviso: string;
  tipoUnidadeId: ITipoUnidade;
  fornecedores?: IFornecedor[];
  preco?: string;
  ipi?: string;
  tipoItemId: ITipoItem;
}

export type IItemComMovimentacao = IItem & {
  quantidadeMovimentada: number;
  quantidadeMovimentadaInput?: string;
};

export interface IUpdateMovimentacoes {
  id: number;
  quantidade: number;
}
