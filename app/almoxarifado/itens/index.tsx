import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import { useEffect, useState } from "react";
import { getAllItens } from "../../../services/almoxarifado/item";
import { colors } from "../../../colors";
import { useLoading } from "../../../context/providers/loading";
import { useAuth } from "../../../context/auth";
import { IItem } from "../../../interfaces/almoxarifado/item";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { socketAlmoxarifado } from "../../../services/httpclient";

export default function Itens() {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();
  const { usuario } = useAuth();

  const selecao = ["TODOS", "EM FALTA", "ESTOQUE OK"];
  const tipoItem = ["TODOS", "EPI", "SUPRIMENTO"];

  const [filtros, setFiltros] = useState<{
    selecao: string;
    tipoItem: string;
  }>({
    selecao: selecao[0],
    tipoItem:
      usuario?.tipoDeAcesso === "adm" || usuario?.tipoDeAcesso === "compras"
        ? tipoItem[0]
        : tipoItem[1],
  });

  const [itens, setItens] = useState<IItem[]>([]);
  const [itensFiltrados, setItensFiltrados] = useState<IItem[]>();
  const [pesquisa, setPesquisa] = useState<string>("");

  function estoqueBaixo(item: IItem) {
    return item.quantidade <= item.quantidadeParaAviso;
  }

  const renderItem = (item: IItem) => {
    const estoqueBaixo = item.quantidade <= item.quantidadeParaAviso;

    return (
      <View
        key={item.id}
        style={[styles.card, estoqueBaixo && { borderLeftColor: colors.red }]}
      >
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          {item.tipoItem.tipo === "EPI" ? (
            <FontAwesome6 name="helmet-safety" size={28} color="black" />
          ) : (
            <AntDesign name="shopping" size={30} color="black" />
          )}
          <View
            style={[
              styles.badge,
              estoqueBaixo && styles.badgeEstoqueBaixo,
              { flexDirection: "row", gap: 4, justifyContent: "center" },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                estoqueBaixo && styles.badgeTextEstoqueBaixo,
              ]}
            >{`${item.tipoItem.tipo}`}</Text>
          </View>

          <View
            style={[styles.badge, estoqueBaixo && styles.badgeEstoqueBaixo]}
          >
            <Text
              style={[
                styles.badgeText,
                estoqueBaixo && styles.badgeTextEstoqueBaixo,
              ]}
            >
              {estoqueBaixo ? "ESTOQUE BAIXO" : "ESTOQUE OK"}
            </Text>
          </View>
        </View>

        <Text style={styles.epi}>{`Nome: ${item.nome}`}</Text>

        {item.tipoItem.tipo === tipoItem[1] && (
          <View style={styles.row}>
            <Text style={styles.label}>C.A.:</Text>
            <Text style={styles.value}>{item.certificadoAprovacao}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Tipo Unidade:</Text>
          <Text style={styles.value}>{item.tipoUnidade.tipo}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fornecedores:</Text>
          <Text style={styles.value}>
            {item.fornecedores.length !== 0
              ? item.fornecedores.map((fornecedor) => `"${fornecedor.nome}"; `)
              : "Nenhum fornecedor cadastrado."}
          </Text>
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

  const filtrar = () => {
    let resultado = [...itens];

    resultado = resultado.filter((item) => {
      // Filtro por estoque
      if (filtros.selecao === selecao[1] && !estoqueBaixo(item)) {
        return false; // só estoque baixo
      }

      if (filtros.selecao === selecao[2] && estoqueBaixo(item)) {
        return false; // só estoque ok
      }

      // Filtro por tipo
      if (filtros.tipoItem !== tipoItem[0]) {
        if (
          filtros.tipoItem === tipoItem[1] &&
          item.tipoItem.tipo !== tipoItem[1]
        ) {
          return false;
        }

        if (
          filtros.tipoItem === tipoItem[2] &&
          item.tipoItem.tipo !== tipoItem[2]
        ) {
          return false;
        }
      }

      if (!item.nome.includes(pesquisa)) {
        return false;
      }

      return true;
    });

    resultado = [...resultado].sort((a, b) => {
      return a.nome.localeCompare(b.nome);
    });

    setItensFiltrados(resultado);
  };

  useEffect(() => {
    filtrar();
  }, [filtros.selecao, filtros.tipoItem, itens, pesquisa]);

  const getData = async () => {
    try {
      showLoading();
      const resultadoItens: IItem[] = await getAllItens();
      setItens(resultadoItens);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    getData();

    const handleItemAtualizado = () => {
      getData();
    };

    socketAlmoxarifado.on("itemAtualizado", handleItemAtualizado);

    socketAlmoxarifado.on("connect_error", (erro: any) => {
      alert(erro.message);
    });

    return () => {
      socketAlmoxarifado.off("itemAtualizado", handleItemAtualizado);
      socketAlmoxarifado.off("connect_error");
    };
  }, []);

  return (
    <View
      style={[
        globalStyles.mainContainer,
        { flexDirection: "column", padding: 24, flex: 1, gap: 4 },
      ]}
    >
      <View style={styles.filtrosContainer}>
        <View style={{ flexDirection: "row", gap: 30 }}>
          {/* FILTROS */}
          <View style={styles.filtrosColumn}>
            <Text style={globalStyles.labelText}>Itens:</Text>
            {(usuario?.tipoDeAcesso === "adm" ||
              usuario?.tipoDeAcesso === "compras") && (
              <Text style={globalStyles.labelText}>Tipo do item:</Text>
            )}
          </View>

          {/* TODOS */}
          <View style={styles.filtrosColumn}>
            {/* Selecao: Todos */}
            <Pressable
              style={globalStyles.radioLabelContainer}
              onPress={() =>
                setFiltros((prev) => ({ ...prev, selecao: selecao[0] }))
              }
            >
              <View style={globalStyles.radioButton}>
                {filtros.selecao === selecao[0] && (
                  <View style={globalStyles.radioFill} />
                )}
              </View>
              <Text
                style={[
                  globalStyles.labelText,
                  filtros.selecao === selecao[0]
                    ? { fontWeight: 700 }
                    : { fontWeight: 400 },
                ]}
                selectable={false}
              >
                Todos
              </Text>
            </Pressable>

            {/* Tipo do item: TODOS */}
            {(usuario?.tipoDeAcesso === "adm" ||
              usuario?.tipoDeAcesso == "compras") && (
              <Pressable
                style={globalStyles.radioLabelContainer}
                onPress={() =>
                  setFiltros((prev) => ({ ...prev, tipoItem: tipoItem[0] }))
                }
              >
                <View style={globalStyles.radioButton}>
                  {filtros.tipoItem === tipoItem[0] && (
                    <View style={globalStyles.radioFill} />
                  )}
                </View>
                <Text
                  style={[
                    globalStyles.labelText,
                    filtros.tipoItem === tipoItem[0]
                      ? { fontWeight: 700 }
                      : { fontWeight: 400 },
                  ]}
                  selectable={false}
                >
                  Todos
                </Text>
              </Pressable>
            )}
          </View>

          {/* Em falta / EPIs */}
          <View style={styles.filtrosColumn}>
            {/* Selecao: Em falta */}
            <Pressable
              style={globalStyles.radioLabelContainer}
              onPress={() =>
                setFiltros((prev) => ({ ...prev, selecao: selecao[1] }))
              }
            >
              <View style={globalStyles.radioButton}>
                {filtros.selecao === selecao[1] && (
                  <View style={globalStyles.radioFill} />
                )}
              </View>
              <Text
                style={[
                  globalStyles.labelText,
                  filtros.selecao === selecao[1]
                    ? { fontWeight: 700 }
                    : { fontWeight: 400 },
                ]}
                selectable={false}
              >
                Em falta
              </Text>
            </Pressable>

            {/* Tipo do item: EPIs */}
            {(usuario?.tipoDeAcesso === "adm" ||
              usuario?.tipoDeAcesso == "compras") && (
              <Pressable
                style={globalStyles.radioLabelContainer}
                onPress={() =>
                  setFiltros((prev) => ({ ...prev, tipoItem: tipoItem[1] }))
                }
              >
                <View style={globalStyles.radioButton}>
                  {filtros.tipoItem === tipoItem[1] && (
                    <View style={globalStyles.radioFill} />
                  )}
                </View>
                <Text
                  style={[
                    globalStyles.labelText,
                    filtros.tipoItem === tipoItem[1]
                      ? { fontWeight: 700 }
                      : { fontWeight: 400 },
                  ]}
                  selectable={false}
                >
                  EPIs
                </Text>
              </Pressable>
            )}
          </View>

          {/* Estoque OK / Suprimentos */}
          <View style={styles.filtrosColumn}>
            {/* Selecao: Estoque OK */}
            <Pressable
              style={globalStyles.radioLabelContainer}
              onPress={() =>
                setFiltros((prev) => ({ ...prev, selecao: selecao[2] }))
              }
            >
              <View style={globalStyles.radioButton}>
                {filtros.selecao === selecao[2] && (
                  <View style={globalStyles.radioFill} />
                )}
              </View>
              <Text
                style={[
                  globalStyles.labelText,
                  filtros.selecao === selecao[2]
                    ? { fontWeight: 700 }
                    : { fontWeight: 400 },
                ]}
                selectable={false}
              >
                Estoque OK
              </Text>
            </Pressable>

            {/* Tipo do item: Suprimentos */}
            {(usuario?.tipoDeAcesso === "adm" ||
              usuario?.tipoDeAcesso == "compras") && (
              <Pressable
                style={globalStyles.radioLabelContainer}
                onPress={() =>
                  setFiltros((prev) => ({ ...prev, tipoItem: tipoItem[2] }))
                }
              >
                <View style={globalStyles.radioButton}>
                  {filtros.tipoItem === tipoItem[2] && (
                    <View style={globalStyles.radioFill} />
                  )}
                </View>
                <Text
                  style={[
                    globalStyles.labelText,
                    filtros.tipoItem === tipoItem[2]
                      ? { fontWeight: 700 }
                      : { fontWeight: 400 },
                  ]}
                  selectable={false}
                >
                  Suprimentos
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* PESQUISAR */}
        <View style={{ width: 500 }}>
          <Text style={globalStyles.labelText} selectable={false}>
            Pesquisar:
          </Text>
          <TextInput
            style={globalStyles.input}
            value={pesquisa}
            onChangeText={(text) => setPesquisa(text)}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            gap: 16,
            padding: 10,
          }}
          style={styles.scrollContainer}
        >
          {itensFiltrados?.map((item) => {
            return renderItem(item);
          })}
        </ScrollView>
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

    backgroundColor: "#dcfce7",

    width: 150,
    alignItems: "center",
  },

  badgeText: {
    color: "#166534",
    fontSize: 16,
    fontWeight: "600",
  },

  badgeEstoqueBaixo: {
    backgroundColor: colors.lightRed,
  },

  badgeTextEstoqueBaixo: {
    color: colors.red,
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
    marginBottom: 12,
    justifyContent: "space-between",
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
