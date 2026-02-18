import {
  ICarga,
  ICargaFiltros,
  INovaCarga,
  IUpdateCarga,
} from "../interfaces/carga";
import { httpClient } from "./httpclient";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

export async function getCargas(): Promise<ICarga[]> {
  const data = await httpClient("/cargas", {
    method: "GET",
  });

  return data.map((c: any) => ({
    ...c,
    chegada: new Date(c.chegada),
    entrada: c.entrada ? new Date(c.entrada) : null,
    saida: c.saida ? new Date(c.saida) : null,
  }));
}

export async function createNovaCarga(novaCarga: INovaCarga) {
  return await httpClient("/cargas", {
    method: "POST",
    body: JSON.stringify(novaCarga),
  });
}

export async function updateCarga(carga: IUpdateCarga, id: number) {
  return await httpClient(`/cargas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(carga),
  });
}

export async function deleteCarga(id: number) {
  return await httpClient(`/cargas/${id}`, {
    method: "DELETE",
  });
}

// export async function exportarCargas(
//   filtros: ICargaFiltros,
//   campos: string[],
//   tipoArquivo: number,
// ) {
//   const token = await AsyncStorage.getItem("token");

//   const fileName = tipoArquivo === 1 ? "cargas.pdf" : "cargas.xlsx";

//   const filePath = Paths.cache + fileName;

//   const response = await fetch(
//     `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/cargas/exportar`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify({ filtros, campos, tipoArquivo }),
//     },
//   );

//   if (!response.ok) {
//     throw new Error("Erro ao exportar");
//   }

//   const buffer = await response.arrayBuffer();
//   const bytes = new Uint8Array(buffer);

//   const exportFile = new File(filePath);

//   exportFile.write(bytes);

//   await Sharing.shareAsync(exportFile.uri);
// }

export async function exportarCargas(
  filtrosSelecionados: ICargaFiltros,
  camposSelecionados: Record<string, any>,
) {
  return await httpClient(`/cargas/filtrar`, {
    method: "POST",
    body: JSON.stringify({
      filtros: filtrosSelecionados,
      campos: camposSelecionados,
    }),
  });
}

function formatarDataHoraUTC(dataIso: string) {
  if (!dataIso) return "";

  const data = new Date(dataIso);

  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  const ano = data.getUTCFullYear();

  const hora = String(data.getUTCHours()).padStart(2, "0");
  const minuto = String(data.getUTCMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

export function exportarExcel(dados: any[]) {
  if (!dados || !dados.length) return;

  const dadosFormatados = dados.map((item) => ({
    ID: item.id,
    Chegada: formatarDataHoraUTC(item.chegada),
    Entrada: formatarDataHoraUTC(item.entrada),
    Saída: formatarDataHoraUTC(item.saida),
    Empresa: item.empresa ?? "",
    Placa: item.placa ?? "",
    "Nº NF": item.numeroNotaFiscal ?? "",
    Operação: traduzirOperacao(item.tipoOperacao),
  }));

  const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);

  const range = XLSX.utils.decode_range(worksheet["!ref"]!);

  // 🔥 Estiliza TODAS as células (centraliza)
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  }

  // 🔥 Estiliza SOMENTE o cabeçalho (linha 0)
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });

    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      font: {
        bold: true,
        color: { rgb: "FFFFFFFF" }, // branco
      },
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FF16A085" }, // 🔥 22,160,133
      },
    };
  }

  // 🔥 Ativa filtro automático no cabeçalho
  worksheet["!autofilter"] = {
    ref: XLSX.utils.encode_range(range),
  };

  // Ajusta largura
  worksheet["!cols"] = [
    { wch: 19 },
    { wch: 19 },
    { wch: 19 },
    { wch: 19 },
    { wch: 19 },
    { wch: 19 },
    { wch: 19 },
    { wch: 19 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cargas");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "cargas.xlsx");
}

function traduzirOperacao(tipo: number) {
  if (tipo === 1) return "Carregamento";
  if (tipo === 2) return "Descarregamento";
  return "";
}

export function exportarPDF(dados: any[]) {
  if (!dados || !dados.length) return;

  const doc = new jsPDF("landscape"); // paisagem fica melhor pra tabela

  // Cabeçalho
  doc.setFontSize(16);
  doc.text("Relatório de Cargas", 14, 15);

  // Monta colunas
  const colunas = [
    "ID",
    "Chegada",
    "Entrada",
    "Saída",
    "Empresa",
    "Placa",
    "Nº NF",
    "Operação",
  ];

  // Monta linhas
  const linhas = dados.map((item) => [
    item.id,
    formatarDataHoraUTC(item.chegada),
    formatarDataHoraUTC(item.entrada),
    formatarDataHoraUTC(item.saida),
    item.empresa ?? "",
    item.placa ?? "",
    item.numeroNotaFiscal ?? "",
    traduzirOperacao(item.tipoOperacao),
  ]);

  autoTable(doc, {
    head: [colunas],
    body: linhas,
    startY: 25,
    styles: {
      fontSize: 8,
    },
    headStyles: {
      fillColor: [22, 160, 133], // verde bonito
    },
  });

  doc.save("cargas.pdf");
}
