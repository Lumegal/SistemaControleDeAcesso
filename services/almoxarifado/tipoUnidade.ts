import { ITipoUnidade } from "../../interfaces/almoxarifado/tipoUnidade";
import { httpClient } from "../httpclient";

export async function getAllTiposUnidade(): Promise<ITipoUnidade[]> {
  return await httpClient(
    "/tipo-unidade",
    {
      method: "GET",
    },
    "http://localhost:3000",
  );
}