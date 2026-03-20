import { Platform, ScrollView, Text, TextInput, View } from "react-native";
import { dataInputStyle, getGlobalStyles } from "../../../globalStyles";
import { useMemo, useState } from "react";
import {
  IMaterialForm,
  IOrcamentoForm,
} from "../../../interfaces/comercial/orcamento";
import { gerarPdfOrcamentoFront } from "../../../services/comercial/orcamento";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { colors } from "../../../colors";
import MenuOptionButton from "../../_components/MenuOptionButton";
import { useLoading } from "../../../context/providers/loading";

export default function NovoOrcamento() {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const nowLocal = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }, []);

  const [form, setForm] = useState<IOrcamentoForm>({
    nomeDoArquivo: "",
    enviarPara: "",
    aosCuidados: "",
    departamento: "",
    telefone: "",
    email: "",
    inscricao: "",
    data: nowLocal,
    materiais: [{ nome: "", preco: "" }],
  });

  const updateField = (field: keyof IOrcamentoForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMaterial = (
    index: number,
    field: keyof IMaterialForm,
    value: any,
  ) => {
    const novosMateriais = [...form.materiais];
    novosMateriais[index] = { ...novosMateriais[index], [field]: value };

    setForm((prev) => ({ ...prev, materiais: novosMateriais }));
  };

  function formatDinheiro(value: string) {
    let numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";

    numericValue = (parseInt(numericValue, 10) / 100).toFixed(2);
    return numericValue.replace(".", ",");
  }

  const removeMaterial = (index: number) => {
    setForm((prev) => ({
      ...prev,
      materiais: prev.materiais.filter((_, i) => i !== index),
    }));
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

  const inputStyle = [
    globalStyles.input,
    {
      borderRadius: 10,
      paddingVertical: 10,
      backgroundColor: "#f9f9f9",
    },
  ];

  const salvarOrcamento = async (form: IOrcamentoForm) => {
    try {
      showLoading();
      await gerarPdfOrcamentoFront(form);
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
            Dados do Orçamento
          </Text>

          <View style={globalStyles.formRow}>
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Data</Text>
              <input
                type="date"
                style={dataInputStyle}
                value={form.data}
                onChange={(e) => updateField("data", e.target.value)}
              />
            </View>

            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Nome do arquivo</Text>
              <TextInput
                style={inputStyle}
                value={form.nomeDoArquivo}
                onChangeText={(text) => updateField("nomeDoArquivo", text)}
              />
            </View>
          </View>

          <View style={globalStyles.formRow}>
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Para</Text>
              <TextInput
                style={inputStyle}
                value={form.enviarPara}
                onChangeText={(text) => updateField("enviarPara", text)}
              />
            </View>

            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>A/C</Text>
              <TextInput
                style={inputStyle}
                value={form.aosCuidados}
                onChangeText={(text) => updateField("aosCuidados", text)}
              />
            </View>
          </View>

          <View style={globalStyles.formRow}>
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Email</Text>
              <TextInput
                style={inputStyle}
                value={form.email}
                onChangeText={(text) => updateField("email", text)}
              />
            </View>

            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>Telefone</Text>
              <TextInput
                style={inputStyle}
                value={form.telefone}
                placeholder="(99) 99999-9999"
                placeholderTextColor={colors.gray}
                maxLength={15}
                keyboardType={Platform.OS === "web" ? "default" : "numeric"}
                onChangeText={(text) => {
                  // só números
                  let value = text.replace(/\D/g, "");

                  // limita a 11 dígitos
                  value = value.slice(0, 11);

                  // formatação
                  if (value.length > 0) {
                    value = value.replace(/^(\d{0,2})/, "($1");
                  }
                  if (value.length >= 3) {
                    value = value.replace(/^\((\d{2})(\d)/, "($1) $2");
                  }
                  if (value.length >= 10) {
                    value = value.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
                  }

                  updateField("telefone", value);
                }}
              />
            </View>
          </View>
        </View>

        {/* Materiais */}
        <View style={cardStyle}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            Materiais
          </Text>

          {form.materiais.map((material, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <View style={globalStyles.labelInputContainer}>
                <Text
                  style={globalStyles.labelText}
                >{`Item ${index + 1}`}</Text>
                <TextInput
                  style={[inputStyle, { flex: 2 }]}
                  value={material.nome}
                  onChangeText={(text) => updateMaterial(index, "nome", text)}
                />
              </View>

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
                    style={[inputStyle, { flex: 1 }]}
                    value={material.preco}
                    placeholder="99,99"
                    placeholderTextColor={colors.gray}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      updateMaterial(index, "preco", formatDinheiro(text))
                    }
                  />
                </View>
              </View>

              {form.materiais.length > 1 && (
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
                  label={<FontAwesome name="trash-o" size={40} color="white" />}
                  onPress={() => removeMaterial(index)}
                />
              )}
            </View>
          ))}

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
                style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
              >
                + Adicionar Item
              </Text>
            }
            onPress={() =>
              setForm((prev) => ({
                ...prev,
                materiais: [...prev.materiais, { nome: "", preco: "" }],
              }))
            }
          />
        </View>
      </ScrollView>

      {/* Botão Gerar PDF */}
      {/* <MenuOptionButton
          containerStyle={{
            borderWidth: 3,
            borderColor: colors.red,
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            alignSelf: "center",
            marginTop: 20,
            marginBottom: 10,
            maxWidth: 250,
          }}
          label={
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Text
                style={{ color: colors.red, fontWeight: "bold", fontSize: 20 }}
              >
                Gerar PDF
              </Text>
              <FontAwesome6 name="file-pdf" size={30} color={colors.red} />
            </View>
          }
          onPress={async () => gerarPdfOrcamentoFront(form)}
        /> */}

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
        onPress={async () => salvarOrcamento(form)}
      />
    </View>
  );
}
