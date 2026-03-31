import {
  ICategoriaFornecedor,
  ICategoriaFornecedorForm,
} from "./categoriaFornecedor";
import { IEndereco, IEnderecoForm } from "./endereco";

export interface IFornecedor {
  id: number;
  nome: string;
  enderecos: IEndereco[];
  categoriasFornecedor: ICategoriaFornecedor[];
}

export interface ICriarFornecedor {
  nome: string;
  enderecos: number[];
  categoriasFornecedor: number[];
}

export interface IFornecedorForm {
  id: number;
  nome: string;
  enderecos: IEnderecoForm[];
  categoriasFornecedor: ICategoriaFornecedorForm[];
}
