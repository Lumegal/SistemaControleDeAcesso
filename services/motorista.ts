import { ICreateMotorista, IMotorista } from "../interfaces/motorista";
import { httpClient } from "./httpclient";

export async function getAllMotoristas(): Promise<IMotorista[]> {
  return await httpClient("/motorista", {
    method: "GET",
  });
}

export async function createMotorista(motorista: ICreateMotorista) {
  return await httpClient("/motorista", {
    method: "POST",
    body: JSON.stringify(motorista),
  });
}
