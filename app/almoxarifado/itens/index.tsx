import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import { useEffect, useState } from "react";
import { getAllEpis } from "../../../services/almoxarifado/epi";
import { IEpi } from "../../../interfaces/almoxarifado/epi";
import { colors } from "../../../colors";
import { useLoading } from "../../../context/providers/loading";
import { ISuprimento } from "../../../interfaces/almoxarifado/suprimentos";

export default function Itens() {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const [filtros, setFiltros] = useState<{
    selecao: 0 | 1 | 2; // 0 = Todos; 1 = Em falta; 2 = Estoque OK
    tipoItem: 0 | 1 | 2; // 0 = Todos; 1 = Epis; 2 = Suprimentos
  }>({
    selecao: 0,
    tipoItem: 0,
  });

  const [epis, setEpis] = useState<IEpi[] | null>(null);
  type Item = IEpi | ISuprimento;

  function isEpi(item: Item): item is IEpi {
    return "certificadoAprovacao" in item;
  }

  function isSuprimento(item: Item): item is ISuprimento {
    return !("certificadoAprovacao" in item);
  }

  function estoqueBaixo(item: Item) {
    return item.quantidade <= item.quantidadeParaAviso;
  }

  const renderEpi = (item: IEpi) => {
    const estoqueBaixo = item.quantidade <= item.quantidadeParaAviso;

    return (
      <View
        key={item.id}
        style={[styles.card, estoqueBaixo && { borderLeftColor: colors.red }]}
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
            style={[styles.quantidade, estoqueBaixo && { color: colors.red }]}
          >
            {item.quantidade} / {item.quantidadeParaAviso}
          </Text>
        </View>
      </View>
    );
  };

  const renderSuprimento = (item: ISuprimento) => {
    const estoqueBaixo = item.quantidade <= item.quantidadeParaAviso;

    return (
      <View
        key={item.id}
        style={[styles.card, estoqueBaixo && { borderLeftColor: colors.red }]}
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
          <Text style={styles.label}>Tipo Unidade:</Text>
          <Text style={styles.value}>{item.tipoUnidade.tipo}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estoque</Text>
          <Text
            style={[styles.quantidade, estoqueBaixo && { color: colors.red }]}
          >
            {item.quantidade} / {item.quantidadeParaAviso}
          </Text>
        </View>
      </View>
    );
  };

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

  const suprimentosMockup: ISuprimento[] = [
    {
      id: 1,
      nome: "item 1",
      quantidade: 10,
      quantidadeParaAviso: 20,
      preco: 20,
      tipoUnidade: { id: 1, tipo: "unidade" },
    },
    {
      id: 2,
      nome: "item 2",
      quantidade: 10,
      quantidadeParaAviso: 20,
      preco: 20,
      tipoUnidade: { id: 1, tipo: "unidade" },
    },
    {
      id: 3,
      nome: "item 3",
      quantidade: 10,
      quantidadeParaAviso: 20,
      preco: 20,
      tipoUnidade: { id: 1, tipo: "unidade" },
    },
    {
      id: 4,
      nome: "item 4",
      quantidade: 10,
      quantidadeParaAviso: 20,
      preco: 20,
      tipoUnidade: { id: 1, tipo: "unidade" },
    },
    {
      id: 5,
      nome: "item 5",
      quantidade: 10,
      quantidadeParaAviso: 20,
      preco: 20,
      tipoUnidade: { id: 1, tipo: "unidade" },
    },
  ];

  const itens = [...(epis ?? []), ...suprimentosMockup];

  const itensFiltrados = itens.filter((item) => {
    // filtro tipo
    if (filtros.tipoItem === 1 && !isEpi(item)) return false;
    if (filtros.tipoItem === 2 && isEpi(item)) return false;

    // filtro estoque
    if (filtros.selecao === 1 && !estoqueBaixo(item)) return false;
    if (filtros.selecao === 2 && estoqueBaixo(item)) return false;

    return true;
  });

  const itensOrdenados = [...itensFiltrados].sort((a, b) => {
    const faltaA = estoqueBaixo(a);
    const faltaB = estoqueBaixo(b);

    if (faltaA !== faltaB) {
      return faltaA ? -1 : 1;
    }

    return a.nome.localeCompare(b.nome);
  });

  return (
    <View
      style={[
        globalStyles.mainContainer,
        { flexDirection: "column", margin: 24, padding: 24, flex: 1 },
      ]}
    >
      <View style={styles.filtrosContainer}>
        <View style={styles.filtrosColumn}>
          <Text style={globalStyles.labelText}>Itens:</Text>
          <Text style={globalStyles.labelText}>Tipo do item:</Text>
        </View>

        <View style={styles.filtrosColumn}>
          {/* Selecao: Todos */}
          <Pressable
            style={globalStyles.radioLabelContainer}
            onPress={() => setFiltros((prev) => ({ ...prev, selecao: 0 }))}
          >
            <View style={globalStyles.radioButton}>
              {filtros.selecao === 0 && <View style={globalStyles.radioFill} />}
            </View>
            <Text
              style={[
                globalStyles.labelText,
                filtros.selecao === 0
                  ? { fontWeight: 700 }
                  : { fontWeight: 400 },
              ]}
              selectable={false}
            >
              Todos
            </Text>
          </Pressable>

          {/* Tipo do item: Todos */}
          <Pressable
            style={globalStyles.radioLabelContainer}
            onPress={() => setFiltros((prev) => ({ ...prev, tipoItem: 0 }))}
          >
            <View style={globalStyles.radioButton}>
              {filtros.tipoItem === 0 && (
                <View style={globalStyles.radioFill} />
              )}
            </View>
            <Text
              style={[
                globalStyles.labelText,
                filtros.tipoItem === 0
                  ? { fontWeight: 700 }
                  : { fontWeight: 400 },
              ]}
              selectable={false}
            >
              Todos
            </Text>
          </Pressable>
        </View>

        <View style={styles.filtrosColumn}>
          {/* Selecao: Em falta */}
          <Pressable
            style={globalStyles.radioLabelContainer}
            onPress={() => setFiltros((prev) => ({ ...prev, selecao: 1 }))}
          >
            <View style={globalStyles.radioButton}>
              {filtros.selecao === 1 && <View style={globalStyles.radioFill} />}
            </View>
            <Text
              style={[
                globalStyles.labelText,
                filtros.selecao === 1
                  ? { fontWeight: 700 }
                  : { fontWeight: 400 },
              ]}
              selectable={false}
            >
              Em falta
            </Text>
          </Pressable>

          {/* Tipo do item: EPIs */}
          <Pressable
            style={globalStyles.radioLabelContainer}
            onPress={() => setFiltros((prev) => ({ ...prev, tipoItem: 1 }))}
          >
            <View style={globalStyles.radioButton}>
              {filtros.tipoItem === 1 && (
                <View style={globalStyles.radioFill} />
              )}
            </View>
            <Text
              style={[
                globalStyles.labelText,
                filtros.tipoItem === 1
                  ? { fontWeight: 700 }
                  : { fontWeight: 400 },
              ]}
              selectable={false}
            >
              EPIs
            </Text>
          </Pressable>
        </View>

        <View style={styles.filtrosColumn}>
          {/* Selecao: Estoque OK */}
          <Pressable
            style={globalStyles.radioLabelContainer}
            onPress={() => setFiltros((prev) => ({ ...prev, selecao: 2 }))}
          >
            <View style={globalStyles.radioButton}>
              {filtros.selecao === 2 && <View style={globalStyles.radioFill} />}
            </View>
            <Text
              style={[
                globalStyles.labelText,
                filtros.selecao === 2
                  ? { fontWeight: 700 }
                  : { fontWeight: 400 },
              ]}
              selectable={false}
            >
              Estoque OK
            </Text>
          </Pressable>

          {/* Tipo do item: Suprimentos */}
          <Pressable
            style={globalStyles.radioLabelContainer}
            onPress={() => setFiltros((prev) => ({ ...prev, tipoItem: 2 }))}
          >
            <View style={globalStyles.radioButton}>
              {filtros.tipoItem === 2 && (
                <View style={globalStyles.radioFill} />
              )}
            </View>
            <Text
              style={[
                globalStyles.labelText,
                filtros.tipoItem === 2
                  ? { fontWeight: 700 }
                  : { fontWeight: 400 },
              ]}
              selectable={false}
            >
              Suprimentos
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row", flex: 1, gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>EPIs</Text>
          <ScrollView
            contentContainerStyle={{
              gap: 16,
              padding: 10,
            }}
            style={styles.scrollContainer}
          >
            {itensOrdenados.map((item) => {
              if (isEpi(item)) return renderEpi(item);
              return null;
            })}
          </ScrollView>
        </View>

        {filtros.tipoItem !== 1 && (
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>SUPRIMENTOS</Text>
            <ScrollView
              contentContainerStyle={{
                gap: 16,
                padding: 10,
              }}
              style={styles.scrollContainer}
            >
              {itensOrdenados.map((item) => {
                if (isSuprimento(item)) return renderSuprimento(item);
                return null;
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 5,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  containerCards: {
    gap: 20,
  },

  filtrosColumn: {
    gap: 10,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    minHeight: 190,

    justifyContent: "space-between",

    borderWidth: 1,
    borderColor: "#e5e7eb",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,

    gap: 6,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,

    fontSize: 11,
    fontWeight: "600",

    backgroundColor: "#dcfce7",
    color: "#166534",
  },

  epi: {
    fontSize: 18,
    fontWeight: "700",
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

  filtrosContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    flexDirection: "row",
    gap: 30,
    marginBottom: 12,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
