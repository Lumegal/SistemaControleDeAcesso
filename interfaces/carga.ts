export interface ICarga {
  id: number;
  chegada: Date;
  entrada: Date | null;
  saida: Date | null;
  empresa: string;
  placa: string;
  motorista: string;
  rgCpf: string;
  celular: string;
  numeroNotaFiscal: string;
  tipoOperacao: number;
}

// formato do backend
export interface INovaCarga {
  chegada: Date;
  entrada?: Date;
  empresa: string;
  placa: string;
  motorista: string;
  rgCpf: string;
  celular: string;
  numeroNotaFiscal?: string;
  tipoOperacao: number;
}

// formato do formulário
export interface INovaCargaForm {
  chegada: string;
  empresa: string;
  placa: string;
  motorista: string;
  rgCpf: string;
  celular: string;
  numeroNotaFiscal: string;
  tipoOperacao: number;
}

export interface IUpdateCarga {
  chegada: Date;
  entrada?: Date | null;
  saida?: Date | null;
}

export interface IUpdateCargaForm {
  chegada: string;
  entrada: string;
  saida: string;
}

export type ICargaFormatada = ICarga & {
  chegadaDataStr: string;
  chegadaHoraStr: string;
  entradaHoraStr: string;
  saidaHoraStr: string;
};
