import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import { dataInputStyle, getGlobalStyles } from "../../globalStyles";
import MenuOptionButton from "../_components/MenuOptionButton";
import { createNovaCarga } from "../../services/cargas";
import { INovaCargaForm, INovaCarga } from "../../interfaces/carga";
import { useLoading } from "../../context/providers/loading";
import { router } from "expo-router";

export default function NovaCarga() {
  const globalStyles = getGlobalStyles();
  const now = new Date();
  const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const { showLoading, hideLoading } = useLoading();

  const [form, setForm] = useState<INovaCargaForm>({
    chegada: nowLocal,
    empresa: "",
    placa: "",
    motorista: "",
    rgCpf: "",
    celular: "",
    numeroNotaFiscal: "",
    tipoOperacao: null,
  });

  const updateField = <K extends keyof INovaCargaForm>(
    field: K,
    value: INovaCargaForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const checkboxSize: number = 24;

  const styles = StyleSheet.create({
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      marginTop: 5,
    },
    checkboxOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    checkboxBox: {
      width: checkboxSize,
      height: checkboxSize,
      borderWidth: 2,
      borderColor: "#555",
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: "#5789f3",
      borderColor: "#5789f3",
    },
    checkboxLabel: {
      fontSize: checkboxSize,
    },
  });

  return (
    <View style={globalStyles.formContainer}>
      <View style={globalStyles.formRow}>
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            CHEGADA*
          </Text>
          <input
            value={form.chegada}
            type="datetime-local"
            style={dataInputStyle}
            onChange={(text) => updateField("chegada", text.target.value)}
          />
        </View>

        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            EMPRESA*
          </Text>
          <TextInput
            style={globalStyles.input}
            onChangeText={(text) => updateField("empresa", text)}
          />
        </View>

        {/* Placa */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            PLACA*
          </Text>
          <TextInput
            style={globalStyles.input}
            onChangeText={(text) => updateField("placa", text)}
          />
        </View>
      </View>

      <View style={globalStyles.formRow}>
        {/* Motorista */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            MOTORISTA*
          </Text>
          <TextInput
            style={globalStyles.input}
            onChangeText={(text) => updateField("motorista", text)}
          />
        </View>

        {/* RG/CPF */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            RG/CPF*
          </Text>
          <TextInput
            style={globalStyles.input}
            onChangeText={(text) => updateField("rgCpf", text)}
          />
        </View>

        {/* Celular */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            CELULAR*
          </Text>
          <TextInput
            style={globalStyles.input}
            onChangeText={(text) => updateField("celular", text)}
          />
        </View>
      </View>

      <View style={globalStyles.formRow}>
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            Nº DA NOTA FISCAL
          </Text>
          <TextInput
            style={globalStyles.input}
            onChangeText={(text) => updateField("numeroNotaFiscal", text)}
          />
        </View>

        {/* Carregamento/Descarregamento */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            CARREGAMENTO / DESCARREGAMENTO*
          </Text>

          <View style={styles.checkboxRow}>
            {/* Carregamento */}
            <Pressable
              style={styles.checkboxOption}
              onPress={() => updateField("tipoOperacao", "carregamento")}
            >
              <View
                style={[
                  styles.checkboxBox,
                  form.tipoOperacao === "carregamento" &&
                    styles.checkboxChecked,
                ]}
              >
                {form.tipoOperacao === "carregamento" && (
                  <Feather name="check" size={checkboxSize} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel} selectable={false}>
                Carregamento
              </Text>
            </Pressable>

            {/* Descarregamento */}
            <Pressable
              style={styles.checkboxOption}
              onPress={() => updateField("tipoOperacao", "descarregamento")}
            >
              <View
                style={[
                  styles.checkboxBox,
                  form.tipoOperacao === "descarregamento" &&
                    styles.checkboxChecked,
                ]}
              >
                {form.tipoOperacao === "descarregamento" && (
                  <Feather name="check" size={checkboxSize} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel} selectable={false}>
                Descarregamento
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View
        style={[globalStyles.formRow, { justifyContent: "flex-end", gap: 50 }]}
      >
        <MenuOptionButton
          containerStyle={[globalStyles.button, { backgroundColor: "#4cad4c" }]}
          labelStyle={globalStyles.buttonText}
          label={
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={globalStyles.buttonText} selectable={false}>
                Salvar
              </Text>
              <Feather name="check-circle" size={24} color="white" />
            </View>
          }
          onPress={async () => {
            try {
              showLoading();
              const carga: INovaCarga = {
                chegada: new Date(form.chegada),
                empresa: form.empresa,
                placa: form.placa,
                motorista: form.motorista,
                rgCpf: form.rgCpf,
                celular: form.celular,
                numeroNotaFiscal: form.numeroNotaFiscal,
                tipoOperacao: form.tipoOperacao === "carregamento" ? 1 : 2,
              };

              console.log(carga);
              const resultado = await createNovaCarga(carga);
              alert("Carga salva com sucesso!");

              router.push({
                pathname: "/main",
                params: {
                  pageName: "operacoes",
                  subPage: "novaCarga",
                },
              });
            } catch (erro: any) {
              alert(erro.message);
            } finally {
              hideLoading();
            }
          }}
        />
      </View>
    </View>
  );
}
