export interface IJwtPayload {
  sub: number;
  email: string;
  nome: string;
  tipoDeAcesso: string;
  exp: number;
}
