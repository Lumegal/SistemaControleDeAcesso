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
  tipoItem: ITipoItem;
}

export interface INovoItemForm {
  nome: string; //ok
  descricao?: string; //ok
  certificadoAprovacao?: string;
  quantidade: string; //ok
  quantidadeParaAviso: string; //ok
  tipoUnidadeId: string; //ok
  fornecedores?: IFornecedorForm[];
  preco?: string;
  ipi?: string;
  tipoItem: string; //ok
}
