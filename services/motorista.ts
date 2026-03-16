import {
  ICreateMotorista,
  IMotorista,
  IUpdateMotorista,
} from "../interfaces/motorista";
import { httpClient } from "./httpclient";

export async function getAllMotoristas(): Promise<IMotorista[]> {
  return await httpClient("/motorista", {
    method: "GET",
  });
}

export async function getMotoristaPorRgCpf(rgCpf: string): Promise<IMotorista> {
  return await httpClient(`/motorista/buscaRgCpf/${rgCpf}`, {
    method: "GET",
  });
}

export async function createMotorista(motorista: ICreateMotorista) {
  return await httpClient("/motorista", {
    method: "POST",
    body: JSON.stringify(motorista),
  });
}

export async function updateMotorista(motorista: IUpdateMotorista, id: number) {
  return await httpClient(`/motorista/${id}`, {
    method: "PATCH",
    body: JSON.stringify(motorista),
  });
}
