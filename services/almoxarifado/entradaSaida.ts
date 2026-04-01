import { IMovimentacaoItem } from "../../interfaces/almoxarifado/entradaSaida";
import { httpClient } from "../httpclient";

export async function confirmarMovimentacoes(itens: IMovimentacaoItem[]) {
  return await httpClient(
    "/entrada-saida-item",
    {
      method: "POST",
      body: JSON.stringify(itens),
    },
    "http://localhost:3000",
  );
}
