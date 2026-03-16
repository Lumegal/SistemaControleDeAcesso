import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";

export default function ItensEmFalta() {
  const globalStyles = getGlobalStyles();

  const itensMockup = [
    {
      epi: "Luva de Segurança",
      ca: "12345",
      tipoUnidade: "Par",
      estoque: 8,
      aviso: 10,
    },
    {
      epi: "Capacete",
      ca: "54321",
      tipoUnidade: "Unidade",
      estoque: 3,
      aviso: 5,
    },
    {
      epi: "Óculos de Proteção",
      ca: "98765",
      tipoUnidade: "Unidade",
      estoque: 4,
      aviso: 8,
    },
    {
      epi: "Óculos de Proteção",
      ca: "98765",
      tipoUnidade: "Unidade",
      estoque: 4,
      aviso: 8,
    },
  ];

  const renderItemEmFalta = (itens: typeof itensMockup) => {
    return (
      <View style={styles.containerCards}>
        {itens.map((item, index) => {
          const emFalta = item.estoque <= item.aviso;

          return (
            <View key={index} style={styles.card}>
              <Text style={styles.badge}>ESTOQUE BAIXO</Text>
              <Text style={styles.epi}>{item.epi}</Text>

              <View style={styles.row}>
                <Text style={styles.label}>C.A.:</Text>
                <Text style={styles.value}>{item.ca}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Tipo Unidade:</Text>
                <Text style={styles.value}>{item.tipoUnidade}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Estoque</Text>

                <Text style={[styles.quantidade, styles.alerta]}>
                  {item.estoque} / {item.aviso}
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

      {renderItemEmFalta(itensMockup)}
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
    flexBasis: 260, // largura base
    minWidth: 260,

    borderWidth: 1,
    borderColor: "#e2e8f0",

    borderLeftWidth: 6,
    borderLeftColor: "#dc2626",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },

    elevation: 3,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
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
    color: "#dc2626",
  },

  alerta: {
    color: "#dc2626",
  },

  normal: {
    color: "#16a34a",
  },
});
