export interface IMotorista {
  id: number;
  nome: string;
  rgCpf: string;
  celular?: string;
}

export interface ICreateMotorista {
  nome: string;
  rgCpf: string;
  celular?: string;
}
