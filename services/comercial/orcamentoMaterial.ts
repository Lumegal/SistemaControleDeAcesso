import { httpClient } from "../httpclient";

export async function getAllOrcamentoMaterial() {
  return await httpClient(
    "/orcamento-material",
    {
      method: "GET",
    },
    "http://localhost:3003",
  );
}