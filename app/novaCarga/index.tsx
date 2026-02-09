import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { dataInputStyle, getGlobalStyles } from "../../globalStyles";
import MenuOptionButton from "../_components/MenuOptionButton";
import { createNovaCarga } from "../../services/cargas";
import { INovaCargaForm, INovaCarga } from "../../interfaces/carga";
import { useLoading } from "../../context/providers/loading";
import { router } from "expo-router";
import { colors } from "../../colors";
import { MaskedTextInput } from "react-native-mask-text";

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
    backgroundColor: colors.lightBlue,
    borderColor: colors.lightBlue,
  },
  checkboxLabel: {
    fontSize: checkboxSize,
  },
});

export default function NovaCarga() {
  const globalStyles = useMemo(() => getGlobalStyles(), []);

  const nowLocal = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }, []);

  const { showLoading, hideLoading } = useLoading();

  const [form, setForm] = useState<INovaCargaForm>({
    chegada: nowLocal,
    empresa: "",
    placa: "",
    motorista: "",
    rgCpf: "",
    celular: "",
    numeroNotaFiscal: "",
    tipoOperacao: 0,
  });

  const updateField = <K extends keyof INovaCargaForm>(
    field: K,
    value: INovaCargaForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={globalStyles.formContainer}>
      <View style={globalStyles.formRow}>
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            CHEGADA*
          </Text>
          <input
            type="datetime-local"
            style={dataInputStyle}
            value={form.chegada}
            onChange={(text) => updateField("chegada", text.target.value)}
          />
        </View>

        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            EMPRESA*
          </Text>
          <TextInput
            style={globalStyles.input}
            value={form.empresa}
            onChangeText={(text) => updateField("empresa", text)}
          />
        </View>

        {/* Placa */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            PLACA*
          </Text>
          <MaskedTextInput
            style={globalStyles.input}
            placeholder="AAA-9999"
            placeholderTextColor={colors.gray}
            mask="AAA-SSSS" // A - Qualquer letra / 9 - Qualquer número / S - Qualquer letra ou número
            value={form.placa}
            onChangeText={(text) => updateField("placa", text.toUpperCase())}
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
            value={form.motorista}
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
            value={form.rgCpf}
            onChangeText={(text) => updateField("rgCpf", text)}
          />
        </View>

        {/* Celular */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            CELULAR*
          </Text>
          <MaskedTextInput
            placeholder="(99) 99999-9999"
            placeholderTextColor={colors.gray}
            style={globalStyles.input}
            mask="(99) 99999-9999"
            keyboardType={Platform.OS === "web" ? "default" : "numeric"}
            value={form.celular}
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
            value={form.numeroNotaFiscal}
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
              onPress={() => updateField("tipoOperacao", 1)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  form.tipoOperacao === 1 && styles.checkboxChecked,
                ]}
              >
                {form.tipoOperacao === 1 && (
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
              onPress={() => updateField("tipoOperacao", 2)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  form.tipoOperacao === 2 && styles.checkboxChecked,
                ]}
              >
                {form.tipoOperacao === 2 && (
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
          containerStyle={[
            globalStyles.button,
            { backgroundColor: colors.green },
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
                tipoOperacao: form.tipoOperacao,
              };

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
