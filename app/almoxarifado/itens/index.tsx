import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import { useEffect, useState } from "react";
import { getAllEpis } from "../../../services/almoxarifado/epi";
import { IEpi } from "../../../interfaces/almoxarifado/epi";
import { colors } from "../../../colors";
import { useLoading } from "../../../context/providers/loading";

export default function Itens() {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const [epis, setEpis] = useState<IEpi[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        showLoading();
        const resultadoEpis = await getAllEpis();
        setEpis(resultadoEpis);
        console.log(resultadoEpis);
      } catch (erro: any) {
        alert(erro.message);
      } finally {
        hideLoading();
      }
    };

    getData();
  }, []);

  const renderItemEmFalta = (itens: IEpi[]) => {
    const itensOrdenados = [...itens].sort((a, b) => {
      const aBaixo = a.quantidade <= a.quantidadeParaAviso;
      const bBaixo = b.quantidade <= b.quantidadeParaAviso;

      if (aBaixo !== bBaixo) {
        return aBaixo ? -1 : 1;
      }

      return a.nome.localeCompare(b.nome, "pt-BR");
    });

    return (
      <View style={styles.containerCards}>
        {itensOrdenados.map((item: IEpi, index: number) => {
          const estoqueBaixo = item.quantidade <= item.quantidadeParaAviso;
          return (
            <View
              key={index}
              style={[
                styles.card,
                estoqueBaixo && { borderLeftColor: colors.red },
              ]}
            >
              <Text
                style={[
                  styles.badge,
                  estoqueBaixo && {
                    color: colors.red,
                    backgroundColor: colors.lightRed,
                  },
                ]}
              >
                {estoqueBaixo ? "ESTOQUE BAIXO" : "ESTOQUE OK"}
              </Text>
              <Text style={styles.epi}>{item.nome}</Text>

              <View style={styles.row}>
                <Text style={styles.label}>C.A.:</Text>
                <Text style={styles.value}>{item.certificadoAprovacao}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Tipo Unidade:</Text>
                <Text style={styles.value}>{item.tipoUnidade.tipo}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Estoque</Text>

                <Text
                  style={[
                    styles.quantidade,
                    estoqueBaixo && { color: colors.red },
                  ]}
                >
                  {item.quantidade} / {item.quantidadeParaAviso}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView
      style={[
        globalStyles.mainContainer,
        { flexDirection: "column", margin: 24, padding: 24, flex: 1 },
      ]}
    >
      <Text style={styles.title}>Itens em falta</Text>

      {renderItemEmFalta(epis)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },

  containerCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 18,

    flexGrow: 1,
    flexBasis: 400, // largura base
    minWidth: 400,

    borderWidth: 1,
    borderColor: "#e2e8f0",

    borderLeftWidth: 6,
    borderLeftColor: colors.green,

    boxShadow: `0px 5px 5px rgba(0, 0, 0, 0.2)`,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.lightGreen,
    color: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
  },

  epi: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0f172a",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  label: {
    color: "#64748b",
    fontWeight: "600",
  },

  value: {
    color: "#0f172a",
    fontWeight: "500",
  },

  quantidade: {
    fontSize: 18,
    fontWeight: "700",
  },
});
