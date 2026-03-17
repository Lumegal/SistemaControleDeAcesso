import { ITipoUnidade } from "./tipoUnidade";

export interface IEpi {
  id: number;
  nome: string;
  descricao: string;
  certificadoAprovacao: string;
  quantidade: number;
  quantidadeParaAviso: number;
  preco: number;
  tipoUnidade: ITipoUnidade;
}
