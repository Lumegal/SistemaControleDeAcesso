import { IEmpresa } from "./empresa";
import { IMotorista } from "./motorista";
import { IPlaca } from "./placa";

export interface ICarga {
  id: number;
  chegada: Date;
  entrada: Date | null;
  saida: Date | null;
  empresa: IEmpresa;
  placa: IPlaca;
  motorista: IMotorista;
  numeroNotaFiscal: string;
  tipoOperacao: number;
}

// formato do backend
export interface INovaCarga {
  chegada: Date;
  entrada?: Date;
  empresaId: number;
  placaId: number;
  motoristaId: number;
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
