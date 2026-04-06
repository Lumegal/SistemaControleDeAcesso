import { ITipoItem } from "../../interfaces/almoxarifado/tipoItem";
import { httpClient } from "../httpclient";

export async function getAllTiposItem(): Promise<ITipoItem[]> {
  return await httpClient(
    "/tipo-item",
    {
      method: "GET",
    },
    "http://localhost:3000",
  );
}