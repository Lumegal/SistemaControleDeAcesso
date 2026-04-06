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
import {
  getAllItens,
  updateQuantidades,
} from "../../../services/almoxarifado/item";
import { colors } from "../../../colors";
import { useLoading } from "../../../context/providers/loading";
import { useAuth } from "../../../context/auth";
import {
  IItem,
  IItemComMovimentacao,
} from "../../../interfaces/almoxarifado/item";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Octicons,
} from "@expo/vector-icons";
import MenuOptionButton from "../../_components/MenuOptionButton";
import { IMovimentacaoItem } from "../../../interfaces/almoxarifado/entradaSaida";
import { confirmarMovimentacoes } from "../../../services/almoxarifado/entradaSaida";
import { socketAlmoxarifado } from "../../../services/httpclient";

export default function EntradaSaida() {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();
  const { usuario } = useAuth();

  const tipoItem = ["TODOS", "EPI", "SUPRIMENTO"];

  const [filtros, setFiltros] = useState<{
    tipoItem: string;
  }>({
    tipoItem:
      usuario?.tipoDeAcesso === "adm" || usuario?.tipoDeAcesso === "compras"
        ? tipoItem[0]
        : tipoItem[1],
  });

  const [itens, setItens] = useState<IItemComMovimentacao[]>([]);
  const [itensFiltrados, setItensFiltrados] =
    useState<IItemComMovimentacao[]>();
  const [pesquisa, setPesquisa] = useState<string>("");

  const temMovimentacao = itens.some(
    (item) => item.quantidadeMovimentada !== 0,
  );

  const updateQuantidadeMovimentada = (
    id: number,
    value: number,
    negativo?: boolean,
  ) => {
    setItens((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const max = item.quantidade ?? 0;

        let valorFinal: number;

        if (negativo) {
          const valorLimitado = Math.min(Math.abs(value), max);
          valorFinal = -valorLimitado;
        } else {
          valorFinal = value;
        }

        return {
          ...item,
          quantidadeMovimentada: valorFinal,
          quantidadeMovimentadaInput:
            valorFinal < 0 ? `-${Math.abs(valorFinal)}` : `${valorFinal}`,
        };
      }),
    );
  };

  const handleConfirmarMovimentacoes = async () => {
    const itensComMovimentacao = itens.filter(
      (item) => item.quantidadeMovimentada !== 0,
    );

    if (itensComMovimentacao.length === 0) {
      alert("Nenhuma movimentação selecionada.");
      return;
    }

    const movimentacoes: IMovimentacaoItem[] = itensComMovimentacao.map(
      (item) => ({
        itemId: item.id,
        quantidade: item.quantidadeMovimentada,
      }),
    );

    const resumo = itensComMovimentacao
      .sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" }),
      )
      .map((item) => `${item.nome}: ${item.quantidadeMovimentada}`)
      .join("\n");

    try {
      showLoading();
      console.log(movimentacoes);
      const resultado = await confirmarMovimentacoes(movimentacoes);

      const resultadoAtualizarItens = await updateQuantidades(movimentacoes);

      alert(`Movimentações confirmadas:\n${resumo}`);

      // resetar valores
      setItens((prev) =>
        prev.map((item) => ({
          ...item,
          quantidadeMovimentada: 0,
          quantidadeMovimentadaInput: "0",
        })),
      );
    } catch (erro: any) {
      console.log(erro.message);
    } finally {
      hideLoading();
    }
  };

  const renderItem = (item: IItemComMovimentacao) => {
    return (
      <View key={item.id} style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            {item.tipoItem.tipo === "EPI" ? (
              <FontAwesome6 name="helmet-safety" size={28} color="black" />
            ) : (
              <AntDesign name="shopping" size={30} color="black" />
            )}
            <View
              style={[
                styles.badge,
                { flexDirection: "row", gap: 4, justifyContent: "center" },
              ]}
            >
              <Text style={styles.badgeText}>{`${item.tipoItem.tipo}`}</Text>
            </View>
          </View>
          <View style={{ gap: 12, position: "absolute", right: 0, top: 0 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 64,
                justifyContent: "center",
              }}
            >
              <MenuOptionButton
                containerStyle={[globalStyles.button, { width: 0 }]}
                label={
                  <Octicons name="feed-plus" size={50} color={colors.green} />
                }
                onPress={() =>
                  updateQuantidadeMovimentada(
                    item.id,
                    item.quantidadeMovimentada + 1,
                    false,
                  )
                }
              />

              <MenuOptionButton
                containerStyle={[globalStyles.button, { width: 0 }]}
                label={
                  <FontAwesome
                    name="minus-circle"
                    size={60}
                    color={colors.red}
                  />
                }
                onPress={() => {
                  const novoValor = item.quantidadeMovimentada - 1;

                  updateQuantidadeMovimentada(
                    item.id,
                    Math.abs(novoValor),
                    novoValor < 0,
                  );
                }}
              />
            </View>
            <TextInput
              style={[globalStyles.input, { textAlign: "right" }]}
              value={item.quantidadeMovimentadaInput}
              keyboardType="numeric"
              onChangeText={(text: string) => {
                const negativo = text.includes("-");

                const numeros = text.replace(/\D/g, "");

                if (numeros === "") {
                  updateQuantidadeMovimentada(item.id, 0);
                  return;
                }

                const valor = parseInt(numeros, 10);

                updateQuantidadeMovimentada(item.id, valor, negativo);
              }}
            />
          </View>
        </View>

        <Text
          style={[styles.itemNome, { marginTop: 50 }]}
        >{`Nome: ${item.nome}`}</Text>

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
          <Text style={styles.quantidade}>{item.quantidade}</Text>
        </View>
      </View>
    );
  };

  const filtrar = () => {
    let resultado = [...itens];

    resultado = resultado.filter((item) => {
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

  const getData = async () => {
    try {
      showLoading();
      const resultadoItens: IItem[] = await getAllItens();
      setItens(
        resultadoItens.map((item) => ({
          ...item,
          quantidadeMovimentada: 0,
          quantidadeMovimentadaInput: "0",
        })),
      );
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

  useEffect(() => {
    filtrar();
  }, [filtros.tipoItem, itens, pesquisa]);

  return (
    <View
      style={[
        globalStyles.mainContainer,
        { flexDirection: "column", padding: 24, flex: 1, gap: 4 },
      ]}
    >
      <View style={styles.filtrosContainer}>
        {/* Lado esquerdo */}
        <View style={styles.filtrosSection}>
          {/* Tipo do item */}
          <View style={styles.filtrosColumn}>
            {(usuario?.tipoDeAcesso === "adm" ||
              usuario?.tipoDeAcesso === "compras") && (
              <Text style={globalStyles.labelText}>Tipo do item:</Text>
            )}
          </View>

          {/* Primeira coluna */}
          <View style={styles.filtrosColumn}>
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

          {/* Segunda coluna */}
          <View style={styles.filtrosColumn}>
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

          {/* Terceira coluna */}
          <View style={styles.filtrosColumn}>
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

          {/* PESQUISAR */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Text style={globalStyles.labelText} selectable={false}>
              Pesquisar:
            </Text>
            <TextInput
              style={[globalStyles.input, { width: 500 }]}
              value={pesquisa}
              onChangeText={(text) => setPesquisa(text)}
            />
          </View>
        </View>

        {/* Lado direito */}
        <View style={styles.filtrosSection}>
          <MenuOptionButton
            enabled={temMovimentacao}
            containerStyle={[
              globalStyles.button,
              {
                backgroundColor: colors.green,
                alignSelf: "center",
                marginTop: 10,
                marginBottom: 10,
                width: null,
              },
            ]}
            labelStyle={globalStyles.buttonText}
            label="Confirmar movimentações"
            onPress={handleConfirmarMovimentacoes}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            gap: 16,
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

  itemNome: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  label: {
    fontSize: 20,
    color: "#64748b",
    fontWeight: "600",
  },

  value: {
    fontSize: 20,
    color: "#0f172a",
    fontWeight: "500",
  },

  quantidade: {
    fontSize: 22,
    fontWeight: "700",
  },

  filtrosContainer: {
    justifyContent: "space-between",
    alignItems: "center",
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

  filtrosSection: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,

    marginRight: -18,
  },
});
