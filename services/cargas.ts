import { ICarga, INovaCarga, IUpdateCarga } from "../interfaces/carga";
import { httpClient } from "./httpclient";

export async function getCargas(): Promise<ICarga[]> {
  const data = await httpClient("/cargas", {
    method: "GET",
  });

  return data.map((c: any) => ({
    ...c,
    chegada: new Date(c.chegada),
    entrada: c.entrada ? new Date(c.entrada) : null,
    saida: c.saida ? new Date(c.saida) : null,
  }));
}

export async function createNovaCarga(novaCarga: INovaCarga) {
  return await httpClient("/cargas", {
    method: "POST",
    body: JSON.stringify(novaCarga),
  });
}

export async function updateCarga(carga: IUpdateCarga, id: number) {
  return await httpClient(`/cargas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(carga),
  });
}

export async function deleteCarga(id: number) {
  return await httpClient(`/cargas/${id}`, {
    method: "DELETE",
  });
}
