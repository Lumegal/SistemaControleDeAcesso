import {
  ICarga,
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

function converterDataBR(valor: string): Date | null {
  if (!valor) return null;

  const [dataParte, horaParte] = valor.split(" ");

  if (!dataParte) return null;

  const [dia, mes, ano] = dataParte.split("/").map(Number);

  let horas = 0;
  let minutos = 0;

  if (horaParte) {
    [horas, minutos] = horaParte.split(":").map(Number);
  }

  return new Date(ano, mes - 1, dia, horas, minutos);
}

export function exportarExcel(dados: any[], camposSelecionados: string[]) {
  if (!dados || !dados.length) return;

  const camposData = ["Chegada", "Entrada", "Saída"];

  const dadosFormatados = dados.map((item) => {
    const novo: any = {};

    camposSelecionados.forEach((campo) => {
      const valor = item[campo];

      if (camposData.includes(campo) && valor) {
        // Converte corretamente para Date
        novo[campo] = converterDataBR(valor);
      } else {
        novo[campo] = valor ?? "";
      }
    });

    return novo;
  });

  const worksheet = XLSX.utils.json_to_sheet(dadosFormatados, {
    header: camposSelecionados,
    cellDates: true, // ESSENCIAL
  });

  const range = XLSX.utils.decode_range(worksheet["!ref"]!);

  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];

      if (!cell) continue;

      const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: col })];

      const nomeColuna = headerCell?.v;

      if (camposData.includes(nomeColuna)) {
        if (cell.v instanceof Date) {
          cell.t = "d"; // força tipo data real
          cell.z = "dd/mm/yyyy hh:mm"; // formato visual
        }
      }

      cell.s = {
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  }

  // Estilo do cabeçalho
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
        color: { rgb: "FFFFFFFF" },
      },
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FF16A085" },
      },
    };
  }

  worksheet["!autofilter"] = {
    ref: XLSX.utils.encode_range(range),
  };

  worksheet["!cols"] = camposSelecionados.map(() => ({ wch: 19 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cargas");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellDates: true,
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "cargas.xlsx");
}

export function exportarPDF(dados: any[], camposSelecionados: string[]) {
  if (!dados || !dados.length) return;

  const doc = new jsPDF("landscape");

  doc.setFontSize(16);
  doc.text("Relatório de Cargas", 14, 15);

  const linhas = dados.map((item) =>
    camposSelecionados.map((campo) => item[campo] ?? ""),
  );

  autoTable(doc, {
    head: [camposSelecionados],
    body: linhas,
    startY: 25,
    styles: {
      fontSize: 8,
    },
    headStyles: {
      fillColor: [22, 160, 133],
    },
  });

  doc.save("cargas.pdf");
}
