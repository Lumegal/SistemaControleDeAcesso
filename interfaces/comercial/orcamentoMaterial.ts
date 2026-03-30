import { IOrcamento, IMaterial, IUpdateOrcamento, IUpdateMaterial } from "./orcamento";

export interface IOrcamentoMaterial {
  id: number;
  orcamento: IOrcamento;
  material: IMaterial;
  preco: number;
}

export interface IUpdateOrcamentoMaterial {
  orcamento?: IUpdateOrcamento;
  material?: IUpdateMaterial;
  preco?: number;
}
