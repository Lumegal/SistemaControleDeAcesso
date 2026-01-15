import { IEmpresa } from "../interfaces/empresa";
import { httpClient } from "./httpclient";

export async function getAllEmpresa(): Promise<IEmpresa[]> {
  return await httpClient("/empresa", {
    method: "GET",
  });
}
