import { ISuprimento } from "../../interfaces/almoxarifado/suprimentos";
import { httpClient } from "../httpclient";

export async function getAllSuprimentos(): Promise<ISuprimento[]> {
  return await httpClient(
    "/suprimento",
    {
      method: "GET",
    },
    "http://localhost:3000",
  );
}
