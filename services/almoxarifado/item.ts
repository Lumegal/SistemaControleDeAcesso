import { ICriarItem, IItem } from "../../interfaces/almoxarifado/item";
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

export async function createItem(item: ICriarItem): Promise<IItem> {
  return await httpClient(
    "/item",
    {
      method: "POST",
      body: JSON.stringify(item),
    },
    "http://localhost:3000",
  );
}
