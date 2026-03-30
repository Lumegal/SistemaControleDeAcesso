import { httpClient } from "../httpclient";

export async function getMateriais() {
  return await httpClient(
    "/material",
    {
      method: "GET",
    },
    "http://localhost:3003",
  );
}

export async function getMaterialByNome(nome: string) {
  return await httpClient(
    "/material",
    {
      method: "GET",
      body: JSON.stringify(nome),
    },
    "http://localhost:3003",
  );
}
