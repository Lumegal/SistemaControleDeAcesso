export interface IOrcamento {
  id: number;
  enviarPara: string;
  aosCuidados: string;
  departamento: string;
  telefone: string;
  email: string;
  inscricao: string;
  data: Date;
  materiais: IMaterial[];
  status: string;
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
