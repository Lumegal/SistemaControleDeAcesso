import { ICreateEmpresa, IEmpresa } from "../interfaces/empresa";
import { httpClient } from "./httpclient";

export async function getAllEmpresas(): Promise<IEmpresa[]> {
  return await httpClient("/empresa", {
    method: "GET",
  });
}

export async function createEmpresa(empresa: ICreateEmpresa) {
  return await httpClient("/empresa", {
    method: "POST",
    body: JSON.stringify(empresa),
  });
}
