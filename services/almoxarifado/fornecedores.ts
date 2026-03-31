import { IFornecedor } from "../../interfaces/almoxarifado/fornecedor";
import { httpClient } from "../httpclient";

export async function getAllFornecedores(): Promise<IFornecedor[]> {
  return await httpClient(
    "/fornecedor",
    {
      method: "GET",
    },
    "http://localhost:3000",
  );
}
