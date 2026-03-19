import { ScrollView, Text, TextInput, View } from "react-native";
import { dataInputStyle, getGlobalStyles } from "../../../globalStyles";
import { useMemo, useState } from "react";
import {
  IMaterialForm,
  IOrcamento,
  IOrcamentoForm,
} from "../../../interfaces/comercial/orcamento";

export default function NovoOrcamento() {
  const globalStyles = getGlobalStyles();
  const nowLocal = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }, []);
  const [form, setForm] = useState<IOrcamentoForm>({
    enviarPara: "",
    aosCuidados: "",
    departamento: "",
    telefone: "",
    email: "",
    inscricao: "",
    data: nowLocal,
    materiais: [
      { nome: "", preco: "" },
      { nome: "", preco: "" },
      { nome: "", preco: "" },
      { nome: "", preco: "" },
      { nome: "", preco: "" },
    ],
  });

  const updateField = (field: keyof IOrcamento, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateMaterial = (
    index: number,
    field: keyof IMaterialForm,
    value: any,
  ) => {
    const novosMateriais = [...form.materiais];

    novosMateriais[index] = {
      ...novosMateriais[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      materiais: novosMateriais,
    }));
  };

  return (
    <View
      style={[
        globalStyles.mainContainer,
        { flexDirection: "column", margin: 24, padding: 24, flex: 1 },
      ]}
    >
      <ScrollView style={{ flex: 1 }}>
        {/* Linha 1 */}
        <View style={[globalStyles.formRow, { zIndex: 999 }]}>
          {/* Data */}
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText} selectable={false}>
              DATA*
            </Text>
            <input
              type="datetime-local"
              style={dataInputStyle}
              value={form.data}
              onChange={(e) => updateField("data", e.target.value)}
            />
            <Text style={globalStyles.errorText} selectable={false}>
              {/* {errors.chegada ?? " "} */}
            </Text>
          </View>
          <View style={globalStyles.labelInputContainer} />
        </View>

        {/* Linha 2 */}
        <View style={[globalStyles.formRow, { zIndex: 999 }]}>
          {/* PARA */}
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>PARA: </Text>
            <TextInput
              style={globalStyles.input}
              value={form.enviarPara}
              onChangeText={(text) => updateField("enviarPara", text)}
            />
          </View>

          {/* A/C */}
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText} selectable={false}>
              A/C*
            </Text>
            <TextInput
              style={globalStyles.input}
              value={form.aosCuidados}
              onChangeText={(text) => updateField("aosCuidados", text)}
            />
          </View>
        </View>

        {/* Linha 3 */}
        <View style={[globalStyles.formRow, { zIndex: 999 }]}>
          {/* DEPARTAMENTO */}
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>DEPARTAMENTO: </Text>
            <TextInput
              style={globalStyles.input}
              value={form.departamento}
              onChangeText={(text) => updateField("departamento", text)}
            />
          </View>

          {/* INSCRIÇÃO */}
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>INSCRIÇÃO: </Text>
            <TextInput
              style={globalStyles.input}
              value={form.inscricao}
              onChangeText={(text) => updateField("inscricao", text)}
            />
          </View>
        </View>

        {/* Linha 4 */}
        <View style={[globalStyles.formRow, { zIndex: 999 }]}>
          {/* EMAIL */}
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>EMAIL: </Text>
            <TextInput
              style={globalStyles.input}
              value={form.email}
              onChangeText={(text) => updateField("email", text)}
            />
          </View>

          {/* TELEFONE */}
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>TELEFONE: </Text>
            <TextInput
              style={globalStyles.input}
              value={form.telefone}
              onChangeText={(text) => updateField("telefone", text)}
            />
          </View>
        </View>

        {/* Linhas 5 - 9 */}
        {form.materiais.map((material, index) => (
          <View key={index} style={globalStyles.formRow}>
            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>ITEM {index + 1}:</Text>
              <TextInput
                style={globalStyles.input}
                value={material.nome}
                onChangeText={(text) => updateMaterial(index, "nome", text)}
              />
            </View>

            <View style={globalStyles.labelInputContainer}>
              <Text style={globalStyles.labelText}>PREÇO/KG:</Text>
              <TextInput
                style={globalStyles.input}
                value={material.preco}
                onChangeText={(text) => updateMaterial(index, "preco", text)}
                keyboardType="numeric"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
