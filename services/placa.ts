import { ICreatePlaca, IPlaca } from "../interfaces/placa";
import { httpClient } from "./httpclient";

export async function getAllPlacas(): Promise<IPlaca[]> {
  return await httpClient("/placa", {
    method: "GET",
  });
}

export async function getPlaca(placa: string): Promise<IPlaca> {
  return await httpClient(`/placa/buscaPlaca/${placa}`, {
    method: "GET",
  });
}

export async function createPlaca(placa: ICreatePlaca) {
  return await httpClient("/placa", {
    method: "POST",
    body: JSON.stringify(placa),
  });
}
