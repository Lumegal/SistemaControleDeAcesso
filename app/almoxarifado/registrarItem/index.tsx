import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import { useEffect, useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { colors } from "../../../colors";
import MenuOptionButton from "../../_components/MenuOptionButton";
import { useLoading } from "../../../context/providers/loading";
import { useAuth } from "../../../context/auth";
import {
  ICriarItem,
  IItem,
  INovoItemForm,
} from "../../../interfaces/almoxarifado/item";
import {
  IFornecedor,
  IFornecedorForm,
} from "../../../interfaces/almoxarifado/fornecedor";
import { ITipoItem } from "../../../interfaces/almoxarifado/tipoItem";
import { ITipoUnidade } from "../../../interfaces/almoxarifado/tipoUnidade";
import { getAllTiposItem } from "../../../services/almoxarifado/tipoItem";
import { getAllTiposUnidade } from "../../../services/almoxarifado/tipoUnidade";
import { getAllFornecedores } from "../../../services/almoxarifado/fornecedores";
import { createItem } from "../../../services/almoxarifado/item";

export default function NovoOrcamento() {
  const globalStyles = getGlobalStyles();
  const { usuario } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [form, setForm] = useState<INovoItemForm>({
    nome: "",
    descricao: "",
    certificadoAprovacao: "",
    quantidade: "0",
    quantidadeParaAviso: "0",
    tipoUnidadeId: { id: 0, tipo: "" },
    fornecedores: [
      { id: 0, nome: "", enderecos: [], categoriasFornecedor: [] },
    ],
    preco: "",
    ipi: "",
    tipoItemId: { id: 0, tipo: "" },
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [tiposItem, setTiposItem] = useState<ITipoItem[]>([]);
  const [tiposUnidade, setTiposUnidade] = useState<ITipoUnidade[]>([]);
  const [fornecedores, setFornecedores] = useState<IFornecedor[]>([]);
  const [dropdowns, setDropdowns] = useState({
    tipoItem: false,
    tipoUnidade: false,
    fornecedor: false,
  });

  const [errors, setErrors] = useState<{
    nome?: string;
    quantidadeParaAviso?: string;
    tipoUnidadeId?: string;
    tipoItem?: string;
  }>({
    nome: " ",
    quantidadeParaAviso: " ",
    tipoUnidadeId: " ",
    tipoItem: " ",
  });

  const validarFormulario = () => {
    const novosErros: typeof errors = {};

    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório.";

    if (!form.quantidadeParaAviso.trim())
      novosErros.quantidadeParaAviso = "A quantidade para aviso é obrigatória.";

    if (!form.tipoUnidadeId.tipo.trim())
      novosErros.tipoUnidadeId = "Tipo de unidade é obrigatório.";

    if (!form.tipoItemId.tipo.trim())
      novosErros.tipoItem = "Tipo do item é obrigatório.";

    setErrors(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  useEffect(() => {
    const getData = async () => {
      try {
        showLoading();
        const resultadoTiposItem = await getAllTiposItem();
        const resultadoTiposUnidade = await getAllTiposUnidade();
        const resultadoFornecedores = await getAllFornecedores();

        setTiposItem(resultadoTiposItem);
        setTiposUnidade(resultadoTiposUnidade);
        setFornecedores(resultadoFornecedores);
      } catch (erro: any) {
        console.log(erro.message);
      } finally {
        hideLoading();
      }
    };

    getData();
  }, []);

  const updateField = <K extends keyof INovoItemForm>(
    field: K,
    value: INovoItemForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateFornecedores = (
    index: number,
    field: keyof IFornecedorForm,
    value: any,
  ) => {
    const novosFornecedores = [...(form.fornecedores || [])];
    novosFornecedores[index] = { ...novosFornecedores[index], [field]: value };

    setForm((prev) => ({ ...prev, fornecedores: novosFornecedores }));
  };

  const updateTipoItem = (value: { id: number; tipo: string }) => {
    setForm((prev) => ({
      ...prev,
      tipoItemId: value,
    }));
  };

  const updateTipoUnidade = (value: { id: number; tipo: string }) => {
    setForm((prev) => ({
      ...prev,
      tipoUnidadeId: value,
    }));
  };

  function formatDinheiro(value: string) {
    let numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";

    numericValue = (parseInt(numericValue, 10) / 100).toFixed(2);
    return numericValue.replace(".", ",");
  }

  function formatStringToOnlyNumber(value: string) {
    let numericValue = value.replace(/\D/g, "");

    // remove zeros à esquerda (exceto se for o único dígito)
    numericValue = numericValue.replace(/^0+/, "");

    return numericValue === "" ? "0" : numericValue;
  }

  const removeFornecedor = (index: number) => {
    setForm((prev) => {
      const lista = (prev.fornecedores || []).filter((_, i) => i !== index);

      return {
        ...prev,
        fornecedores:
          lista.length > 0
            ? lista
            : [{ id: 0, nome: "", enderecos: [], categoriasFornecedor: [] }],
      };
    });
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  };

  const criarItem = async (form: INovoItemForm) => {
    if (!validarFormulario()) return;
    try {
      showLoading();

      console.log("form: ", form);

      const criarItem: ICriarItem = {
        ...form,
        quantidade: Number(form.quantidade),
        quantidadeParaAviso: Number(form.quantidade),
        tipoUnidadeId: form.tipoUnidadeId.id,
        fornecedores:
          form.fornecedores?.map((fornecedor) => {
            return fornecedor.id;
          }) ?? [],
        tipoItemId: form.tipoItemId.id,
        ipi: Number(form.ipi),
        preco: form.preco ? form.preco : "0.00"
      };
      
      const itemCriado: IItem = await createItem(criarItem);

      alert("Item criado com sucesso!");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#f2f4f7",
      }}
    >
      <ScrollView>
        {/* Dados gerais */}
        <View style={cardStyle}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            Dados do Item
          </Text>

          {/* NOME E DESCRIÇÃO */}
          <View style={globalStyles.formRow}>
            {/* NOME */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Nome*</Text>
              <TextInput
                style={globalStyles.input}
                value={form.nome}
                onChangeText={(text) => {
                  updateField("nome", text);
                  setErrors((prev) => ({ ...prev, nome: " " }));
                }}
              />
              <Text style={globalStyles.errorText} selectable={false}>
                {errors.nome ?? " "}
              </Text>
            </View>

            {/* DESCRIÇÃO */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Descrição</Text>
              <TextInput
                style={globalStyles.input}
                value={form.descricao}
                onChangeText={(text) => updateField("descricao", text)}
              />
              <Text style={globalStyles.errorText} selectable={false}>
                {" "}
              </Text>
            </View>
          </View>

          {/* TIPO ITEM E TIPO UNIDADE */}
          <View style={[globalStyles.formRow, { zIndex: 999 }]}>
            {/* TIPO ITEM */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Tipo Item*</Text>
              <TextInput
                editable={false}
                style={globalStyles.input}
                value={form.tipoItemId.tipo}
                onFocus={() =>
                  setDropdowns((prev) => ({ ...prev, tipoItem: true }))
                }
                onBlur={() =>
                  setTimeout(() => {
                    setDropdowns((prev) => ({ ...prev, tipoItem: false }));
                  }, 150)
                }
              />
              {dropdowns.tipoItem && tiposItem.length > 0 && (
                <View style={globalStyles.dropdownContainer}>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                  >
                    {tiposItem.map((tipoItem) => (
                      <Pressable
                        key={tipoItem.id}
                        style={{ padding: 10 }}
                        onPress={() => {
                          updateTipoItem(tipoItem);
                          setErrors((prev) => ({
                            ...prev,
                            tipoItem: undefined,
                          }));
                          setDropdowns((prev) => ({
                            ...prev,
                            tipoItem: false,
                          }));
                        }}
                      >
                        <Text>{tipoItem.tipo}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
              <Text style={globalStyles.errorText} selectable={false}>
                {errors.tipoItem ?? " "}
              </Text>
            </View>

            {/* TIPO UNIDADE */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Tipo Unidade*</Text>
              <TextInput
                editable={false}
                style={globalStyles.input}
                value={form.tipoUnidadeId.tipo}
                onFocus={() =>
                  setDropdowns((prev) => ({ ...prev, tipoUnidade: true }))
                }
                onBlur={() =>
                  setTimeout(() => {
                    setDropdowns((prev) => ({ ...prev, tipoUnidade: false }));
                  }, 150)
                }
              />

              {dropdowns.tipoUnidade && tiposItem.length > 0 && (
                <View style={globalStyles.dropdownContainer}>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                  >
                    {tiposUnidade.map((tipoUnidade) => (
                      <Pressable
                        key={tipoUnidade.id}
                        style={{ padding: 10 }}
                        onPress={() => {
                          updateTipoUnidade(tipoUnidade);
                          setErrors((prev) => ({
                            ...prev,
                            tipoUnidade: undefined,
                          }));
                          setDropdowns((prev) => ({
                            ...prev,
                            tipoUnidade: false,
                          }));
                        }}
                      >
                        <Text>{tipoUnidade.tipo}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Text style={globalStyles.errorText} selectable={false}>
                {errors.tipoUnidadeId ?? " "}
              </Text>
            </View>
          </View>

          {/* QUANTIDADE E QUANTIDADE PARA AVISO */}
          <View style={globalStyles.formRow}>
            {/* QUANTIDADE */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Quantidade*</Text>
              <TextInput
                style={globalStyles.input}
                value={form.quantidade}
                onChangeText={(text) =>
                  updateField("quantidade", formatStringToOnlyNumber(text))
                }
              />
              <Text style={globalStyles.errorText} selectable={false}>
                {" "}
              </Text>
            </View>

            {/* QUANTIDADE PARA AVISO */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Quantidade para aviso*</Text>
              <TextInput
                style={globalStyles.input}
                value={form.quantidadeParaAviso}
                onChangeText={(text) =>
                  updateField(
                    "quantidadeParaAviso",
                    formatStringToOnlyNumber(text),
                  )
                }
              />
              <Text style={globalStyles.errorText} selectable={false}>
                {" "}
              </Text>
            </View>
          </View>

          {/* PREÇO E IPI */}
          {(usuario?.tipoDeAcesso === "adm" ||
            usuario?.tipoDeAcesso === "compras") && (
            <View style={globalStyles.formRow}>
              {/* PREÇO */}
              <View style={globalStyles.labelInputContainer}>
                <Text style={globalStyles.labelText}>Preço</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text style={{ fontSize: 24, fontWeight: "bold" }}>R$</Text>
                  <TextInput
                    style={[globalStyles.input, { flex: 1 }]}
                    value={form.preco}
                    placeholder="99,99"
                    placeholderTextColor={colors.gray}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      updateField("preco", formatDinheiro(text));
                      setErrors((prev) => ({ ...prev, item: " " }));
                    }}
                  />
                </View>
                <Text style={globalStyles.errorText} selectable={false}>
                  {" "}
                </Text>
              </View>

              {/* IPI */}
              <View style={globalStyles.labelInputContainer}>
                <Text style={globalStyles.labelText}>IPI</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TextInput
                    style={[globalStyles.input, { flex: 1 }]}
                    value={form.ipi}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      let numericValue = text.replace(/\D/g, "");
                      if (!numericValue) return "";

                      numericValue = (parseInt(numericValue, 10) / 100).toFixed(
                        2,
                      );

                      updateField("ipi", numericValue.replace(".", ","));
                    }}
                  />
                  <Text style={{ fontSize: 24, fontWeight: "bold" }}>%</Text>
                </View>
                <Text style={globalStyles.errorText} selectable={false}>
                  {" "}
                </Text>
              </View>
            </View>
          )}

          {/* C.A */}
          <View style={globalStyles.formRow}>
            {/* C.A. */}
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>
                Certificado de aprovação
              </Text>
              <TextInput
                style={globalStyles.input}
                value={form.certificadoAprovacao}
                onChangeText={(text) => {
                  updateField("certificadoAprovacao", text);
                }}
              />
            </View>

            {/* DESCRIÇÃO */}
            <View style={globalStyles.labelInputContainer} />
          </View>
        </View>

        {/* Fornecedores */}
        <View style={cardStyle}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            Fornecedores
          </Text>

          {form.fornecedores &&
            form.fornecedores.map((fornecedor, index) => {
              const fornecedoresDisponiveis = fornecedores.filter((f) => {
                return !form.fornecedores?.some(
                  (selecionado, i) => selecionado.id === f.id && i !== index,
                );
              });

              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginBottom: 10,
                    alignItems: "center",
                    zIndex: 999 - index,
                  }}
                >
                  <View style={{ position: "relative", flex: 1 }}>
                    <View style={globalStyles.labelInputContainer}>
                      <Text
                        style={globalStyles.labelText}
                      >{`Fornecedor ${index + 1}`}</Text>
                      <TextInput
                        editable={false}
                        style={[globalStyles.input, { flex: 2 }]}
                        value={fornecedor.nome}
                        onChangeText={(text) => {
                          updateFornecedores(index, "nome", text);
                          setErrors((prev) => ({ ...prev, item: " " }));
                        }}
                        onFocus={() => setActiveIndex(index)}
                        onBlur={() =>
                          setTimeout(() => {
                            setActiveIndex(null);
                          }, 150)
                        }
                      />
                    </View>

                    {activeIndex === index && (
                      <View
                        style={{
                          position: "absolute",
                          top: 95, // 👈 ajusta conforme altura do input
                          left: 0,
                          right: 0,
                          backgroundColor: "white",
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 8,
                          maxHeight: 200,
                          zIndex: 999,
                          marginHorizontal: 12,
                        }}
                      >
                        <ScrollView
                          keyboardShouldPersistTaps="handled"
                          nestedScrollEnabled
                        >
                          {fornecedoresDisponiveis.length === 0 ? (
                            <Text
                              style={{
                                padding: 10,
                                color: "gray",
                                fontStyle: "italic",
                              }}
                            >
                              Não há mais fornecedores disponíveis
                            </Text>
                          ) : (
                            fornecedoresDisponiveis.map((fornecedor) => (
                              <Pressable
                                key={fornecedor.id}
                                style={{ padding: 10 }}
                                onPress={() => {
                                  setForm((prev) => {
                                    const lista = [
                                      ...(prev.fornecedores || []),
                                    ];
                                    lista[index] = fornecedor;

                                    return {
                                      ...prev,
                                      fornecedores: lista,
                                    };
                                  });

                                  setActiveIndex(null);
                                }}
                              >
                                <Text>{fornecedor.nome}</Text>
                              </Pressable>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* BOTAO DE EXCLUIR FORNECEDOR */}
                  {form.fornecedores && (
                    <MenuOptionButton
                      containerStyle={{
                        backgroundColor: colors.red,
                        height: "48%",
                        width: "3.5%",
                        borderRadius: 10,
                        alignSelf: "flex-end",
                        marginBottom: 12,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      label={
                        <FontAwesome name="trash-o" size={40} color="white" />
                      }
                      onPress={() => removeFornecedor(index)}
                    />
                  )}
                </View>
              );
            })}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={globalStyles.errorText} selectable={false}>
              {" "}
            </Text>

            {/* ADICIONAR FORNECEDOR */}
            {form.fornecedores &&
              form.fornecedores?.length !== 3 &&
              form.fornecedores[0].id !== 0 && (
                <MenuOptionButton
                  containerStyle={{
                    backgroundColor: colors.green,
                    padding: 12,
                    borderRadius: 10,
                    marginTop: 10,
                    alignItems: "center",
                    alignSelf: "flex-end",
                    maxWidth: 250,
                  }}
                  label={
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 20,
                      }}
                    >
                      + Adicionar Fornecedor
                    </Text>
                  }
                  onPress={() =>
                    setForm((prev) => ({
                      ...prev,
                      fornecedores: [
                        ...(prev.fornecedores || []),
                        {
                          id: 0,
                          nome: "",
                          enderecos: [],
                          categoriasFornecedor: [],
                        },
                      ],
                    }))
                  }
                />
              )}
          </View>
        </View>
      </ScrollView>

      <MenuOptionButton
        containerStyle={[
          globalStyles.button,
          {
            backgroundColor: colors.green,
            alignSelf: "center",
            marginTop: 10,
            marginBottom: 10,
          },
        ]}
        labelStyle={globalStyles.buttonText}
        label={
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={globalStyles.buttonText} selectable={false}>
              Salvar
            </Text>
            <Feather name="check-circle" size={24} color="white" />
          </View>
        }
        onPress={async () => criarItem(form)}
      />
    </View>
  );
}
