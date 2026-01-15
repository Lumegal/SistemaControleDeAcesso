export interface IEmpresa {
  id: number;
  nome: string;
  ativo: boolean;
}

export interface ICreateEmpresa {
  nome: string;
  ativo: boolean;
}

export interface IUpdateEmpresa {
  nome?: string;
  ativo?: boolean;
}
