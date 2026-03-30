import { IEpi } from "../../interfaces/almoxarifado/epi";
import { httpClient } from "../httpclient";

export async function getAllEpis(): Promise<IEpi[]> {
  return await httpClient(
    "/epi",
    {
      method: "GET",
    },
    "http://localhost:3000",
  );
}
