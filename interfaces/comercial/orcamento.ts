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
}

export interface IMaterial {
  id: number;
  nome: string;
  preco: number;
}

export interface IOrcamentoForm {
  nomeDoArquivo: string
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
  nome: string;
  preco: string;
}
