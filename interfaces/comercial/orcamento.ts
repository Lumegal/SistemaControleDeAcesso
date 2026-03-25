import {
  IOrcamentoMaterial,
  IUpdateOrcamentoMaterial,
} from "./orcamentoMaterial";

export interface IOrcamento {
  id: number;
  enviarPara: string;
  aosCuidados: string;
  departamento: string;
  telefone: string;
  email: string;
  inscricao: string;
  data: Date;
  materiais: IOrcamentoMaterial[];
  status: string;
  motivoRecusa: string
}

export interface IMaterial {
  id: number;
  nome: string;
  preco: number;
}

export interface ICreateOrcamento {
  enviarPara: string;
  aosCuidados: string;
  departamento: string;
  telefone: string;
  email: string;
  inscricao: string;
  data: string; // ou Date
  status: string;
  usuarioId: number;

  materiais: ICreateMaterial[];
}

export interface ICreateMaterial {
  nome: string;
  preco: string;
}

export interface IOrcamentoForm {
  nomeDoArquivo: string;
  enviarPara: string;
  aosCuidados: string;
  departamento: string;
  telefone: string;
  email: string;
  inscricao: string;
  data: string;
  materiais: IMaterialForm[];
}

export interface IMaterialForm {
  id?: number;
  nome: string;
  preco: string;
}

export interface IUpdateOrcamento {
  enviarPara?: string;
  aosCuidados?: string;
  departamento?: string;
  telefone?: string;
  email?: string;
  inscricao?: string;
  data?: Date;
  materiais?: IUpdateOrcamentoMaterial[];
  status?: string;
  motivoRecusa?: string
}

export interface IUpdateMaterial {
  nome?: string;
  preco?: number;
}

export type IOrcamentoFiltros = {
  dataInicial: string;
  dataFinal: string;
  id: string;
  enviarPara: string;
  inscricao: string;
  email: string;
  telefone: string;
  departamento: string;
  aosCuidadosDe: string;
  status: string
  motivoRecusa: string
};