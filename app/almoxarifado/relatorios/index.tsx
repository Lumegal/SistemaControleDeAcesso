import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useState } from "react";
import { dataInputStyle, getGlobalStyles } from "../../../globalStyles";
import { useAuth } from "../../../context/auth";
import { useLoading } from "../../../context/providers/loading";
import {
  gerarRelatorioMovimentacoesExcel,
  gerarRelatorioMovimentacoesPDF,
} from "../../../services/almoxarifado/entradaSaida";

export default function Relatorios() {
  const { usuario } = useAuth();
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const nowLocal = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }, []);

  const [dataInicial, setDataInicial] = useState<string>(nowLocal);
  const [dataFinal, setDataFinal] = useState<string>(nowLocal);

  const gerarRelatorio = async (tipoRelatorio: string) => {
    try {
      showLoading();
      if (tipoRelatorio === "PDF")
        await gerarRelatorioMovimentacoesPDF(dataInicial, dataFinal);

      if (tipoRelatorio === "EXCEL")
        await gerarRelatorioMovimentacoesExcel(dataInicial, dataFinal);

      alert("Relatório gerado com sucesso!");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <View style={globalStyles.background}>
      <Text style={globalStyles.labelText}>GERAR RELATÓRIO</Text>

      <View
        style={[
          globalStyles.mainContainer,
          { flexDirection: "column", gap: 40, marginTop: -80 },
        ]}
      >
        {/* Seleção de datas */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <View style={globalStyles.formRow}>
            {/* Data inicial */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText} selectable={false}>
                Data inicial
              </Text>
              <input
                type="date"
                style={dataInputStyle}
                value={dataInicial}
                onChange={(text) => {
                  setDataInicial(text.target.value);
                }}
              />
            </View>

            {/* Data final */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText} selectable={false}>
                Data final
              </Text>
              <input
                type="date"
                style={dataInputStyle}
                value={dataFinal}
                onChange={(text) => {
                  setDataFinal(text.target.value);
                }}
              />
            </View>
          </View>
        </View>

        {/* Botões de gerar */}
        <View style={styles.downloadContainer}>
          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: "#e74c3c" }]}
            onPress={() => gerarRelatorio("PDF")}
          >
            <AntDesign name="file-pdf" size={24} color="#fff" />
            <Text style={styles.downloadButtonText}>Gerar PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: "#2ecc71" }]}
            onPress={() => gerarRelatorio("EXCEL")}
          >
            <MaterialCommunityIcons
              name="microsoft-excel"
              size={28}
              color="#fff"
            />
            <Text style={styles.downloadButtonText}>Gerar XLSX</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dateCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: 160,
    gap: 10,
    elevation: 3,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateTouchable: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  lightBorder: {
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  darkBorder: {
    borderColor: "#fff",
    backgroundColor: "#2a2a2a",
  },
  downloadContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    flexWrap: "wrap",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 160,
    justifyContent: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
