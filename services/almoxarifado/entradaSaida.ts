import {
  IEntradaSaida,
  IMovimentacaoItem,
} from "../../interfaces/almoxarifado/entradaSaida";
import { httpClient } from "../httpclient";
import * as XLSX from "xlsx-js-style";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

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

export async function gerarRelatorioMovimentacoesPDF(
  dataInicial: string,
  dataFinal: string,
) {
  const dados: IEntradaSaida[] = await httpClient(
    `/entrada-saida-item/${dataInicial}/${dataFinal}`,
    {
      method: "GET",
    },
    "http://localhost:3000",
  );

  if (!dados || !dados.length)
    throw new Error("Nenhuma movimentação foi feita nesse período.");

  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  // =========================
  // 📅 FILTRAR POR MÊS
  // =========================
  const dadosFiltrados = dados.filter((mov) => {
    const data = new Date(mov.data);
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
  });

  if (!dadosFiltrados.length)
    throw new Error("Nenhuma movimentação encontrada no mês atual.");

  // =========================
  // 📄 PREPARAR DADOS
  // =========================
  const movimentacoes = dadosFiltrados.map((mov) => {
    const item = mov.item;
    const preco = Number(item.preco || 0);
    const total = preco * mov.quantidade;

    return [
      new Date(mov.data).toLocaleDateString("pt-BR"),
      item.nome,
      item.tipoItem?.tipo,
      mov.quantidade,
      preco.toFixed(2),
      total.toFixed(2),
    ];
  });

  const resumoMap: any = {};

  dadosFiltrados.forEach((mov) => {
    const item = mov.item;
    const nome = item.nome;
    const tipo = item.tipoItem?.tipo;
    const preco = Number(item.preco || 0);

    if (!resumoMap[nome]) {
      resumoMap[nome] = {
        tipo,
        entradas: 0,
        saidas: 0,
        valor: 0,
      };
    }

    if (mov.quantidade > 0) {
      resumoMap[nome].entradas += mov.quantidade;
    } else {
      resumoMap[nome].saidas += Math.abs(mov.quantidade);
    }

    resumoMap[nome].valor += preco * mov.quantidade;
  });

  const resumoArray = Object.entries(resumoMap).map(([nome, d]: any) => [
    nome,
    d.tipo,
    d.entradas,
    d.saidas,
    d.entradas - d.saidas,
    d.valor.toFixed(2),
  ]);

  const tipoMap: any = {};

  resumoArray.forEach((item: any) => {
    const tipo = item[1];
    const valor = Number(item[5]);

    if (!tipoMap[tipo]) tipoMap[tipo] = 0;
    tipoMap[tipo] += valor;
  });

  const resumoTipo = Object.entries(tipoMap).map(([tipo, valor]) => [
    tipo,
    Number(valor).toFixed(2),
  ]);

  // =========================
  // 📄 CRIAR PDF
  // =========================
  const doc = new jsPDF();

  let y = 10;

  // Título
  doc.setFontSize(16);
  doc.text(`Relatório - ${mesAtual + 1}/${anoAtual}`, 14, y);
  y += 10;

  // =========================
  // 📄 TABELA MOVIMENTAÇÕES
  // =========================
  doc.setFontSize(12);
  doc.text("Movimentações", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Data", "Item", "Tipo", "Qtd", "Preço", "Total"]],
    body: movimentacoes,
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [30, 64, 175], // azul
      textColor: 255,
    },
    didParseCell: (data) => {
      // destacar negativos
      if (data.column.index === 3 && Number(data.cell.raw) < 0) {
        data.cell.styles.textColor = [255, 0, 0];
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // =========================
  // 📊 RESUMO POR ITEM
  // =========================
  doc.text("Resumo por Item", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Item", "Tipo", "Entradas", "Saídas", "Saldo", "Valor (R$)"]],
    body: resumoArray,
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
    },
    didParseCell: (data) => {
      // saldo negativo em vermelho
      if (data.column.index === 4 && Number(data.cell.raw) < 0) {
        data.cell.styles.textColor = [255, 0, 0];
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // =========================
  // 📊 RESUMO POR TIPO
  // =========================
  doc.text("Resumo por Tipo", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Tipo", "Valor Total (R$)"]],
    body: resumoTipo,
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
    },
  });

  // =========================
  // 💾 EXPORTAR
  // =========================
  const blob = doc.output("blob");
  saveAs(blob, `relatorio_${mesAtual + 1}_${anoAtual}.pdf`);
}

export async function gerarRelatorioMovimentacoesExcel(
  dataInicial: string,
  dataFinal: string,
) {
  const dados: IEntradaSaida[] = await httpClient(
    `/entrada-saida-item/${dataInicial}/${dataFinal}`,
    {
      method: "GET",
    },
    "http://localhost:3000",
  );

  if (!dados || !dados.length)
    throw new Error("Nenhuma movimentação foi feita nesse período.");

  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  // =========================
  // 📅 FILTRAR POR MÊS
  // =========================
  const dadosFiltrados = dados.filter((mov) => {
    const data = new Date(mov.data);
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
  });

  // =========================
  // 📄 ABA 1 - MOVIMENTAÇÕES
  // =========================
  const movimentacoes = dadosFiltrados.map((mov) => {
    const item = mov.item;
    const preco = Number(item.preco || 0);
    const total = preco * mov.quantidade;

    return {
      Data: new Date(mov.data).toLocaleDateString("pt-BR"),
      Item: item.nome,
      Tipo: item.tipoItem?.tipo,
      Quantidade: mov.quantidade,
      "Preço Unitário": preco,
      "Valor Total": total,
    };
  });

  const wsMov = XLSX.utils.json_to_sheet(movimentacoes);

  /** largura das colunas */
  wsMov["!cols"] = [
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
  ];

  // =========================
  // 📊 RESUMO POR ITEM
  // =========================
  const resumoMap: any = {};

  dadosFiltrados.forEach((mov) => {
    const item = mov.item;
    const nome = item.nome;
    const tipo = item.tipoItem?.tipo;
    const preco = Number(item.preco || 0);

    if (!resumoMap[nome]) {
      resumoMap[nome] = {
        tipo,
        entradas: 0,
        saidas: 0,
        valor: 0,
      };
    }

    if (mov.quantidade > 0) {
      resumoMap[nome].entradas += mov.quantidade;
    } else {
      resumoMap[nome].saidas += Math.abs(mov.quantidade);
    }

    resumoMap[nome].valor += preco * mov.quantidade;
  });

  const resumoArray = Object.entries(resumoMap).map(([nome, dados]: any) => ({
    Item: nome,
    Tipo: dados.tipo,
    Entradas: dados.entradas,
    Saídas: dados.saidas,
    Saldo: dados.entradas - dados.saidas,
    "Valor Total (R$)": dados.valor,
  }));

  const wsResumo = XLSX.utils.json_to_sheet(resumoArray);

  /** largura das colunas */
  wsResumo["!cols"] = [
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
  ];

  // =========================
  // 📊 RESUMO POR TIPO (EPI/SUPRIMENTO)
  // =========================
  const tipoMap: any = {};

  resumoArray.forEach((item) => {
    if (!tipoMap[item.Tipo]) {
      tipoMap[item.Tipo] = 0;
    }

    tipoMap[item.Tipo] += item["Valor Total (R$)"];
  });

  const resumoTipo = Object.entries(tipoMap).map(([tipo, valor]) => ({
    Tipo: tipo,
    "Valor Total (R$)": valor,
  }));

  const wsTipo = XLSX.utils.json_to_sheet(resumoTipo);

  /** largura das colunas */
  wsTipo["!cols"] = [
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
    { wpx: 150 },
  ];

  // =========================
  // 🎨 ESTILOS
  // =========================
  const aplicarHeader = (ws: XLSX.WorkSheet) => {
    const range = XLSX.utils.decode_range(ws["!ref"] || "");
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c });
      if (!ws[cell]) continue;

      ws[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1E40AF" } },
        alignment: { horizontal: "center" },
      };
    }
  };

  const destacarNegativos = (ws: XLSX.WorkSheet) => {
    const range = XLSX.utils.decode_range(ws["!ref"] || "");

    for (let r = 1; r <= range.e.r; r++) {
      const cellSaldo = XLSX.utils.encode_cell({ r, c: 4 }); // coluna saldo

      if (ws[cellSaldo] && ws[cellSaldo].v < 0) {
        ws[cellSaldo].s = {
          font: { color: { rgb: "FF0000" }, bold: true },
        };
      }
    }
  };

  aplicarHeader(wsMov);
  aplicarHeader(wsResumo);
  aplicarHeader(wsTipo);
  destacarNegativos(wsResumo);

  // =========================
  // 📦 WORKBOOK
  // =========================
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, wsMov, "Movimentações");
  XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo por Item");
  XLSX.utils.book_append_sheet(wb, wsTipo, "Resumo por Tipo");

  // =========================
  // 💾 EXPORTAR
  // =========================
  XLSX.writeFile(wb, `relatorio_${mesAtual + 1}_${anoAtual}.xlsx`);
}
