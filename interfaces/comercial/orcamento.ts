export interface IOrcamento {
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
  nome: string;
  preco: number;
}

export interface IOrcamentoForm {
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
