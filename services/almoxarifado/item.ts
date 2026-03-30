import { IItem } from "../../interfaces/almoxarifado/item";
import { httpClient } from "../httpclient";

export async function getAllItens(): Promise<IItem[]> {
  return await httpClient(
    "/item",
    {
      method: "GET",
    },
    "http://localhost:3000",
  );
}
