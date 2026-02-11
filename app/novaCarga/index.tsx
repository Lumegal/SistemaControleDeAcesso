import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { dataInputStyle, getGlobalStyles } from "../../globalStyles";
import MenuOptionButton from "../_components/MenuOptionButton";
import { createNovaCarga } from "../../services/cargas";
import { INovaCargaForm, INovaCarga } from "../../interfaces/carga";
import { useLoading } from "../../context/providers/loading";
import { router } from "expo-router";
import { colors } from "../../colors";
import { MaskedTextInput } from "react-native-mask-text";
import { createMotorista, getAllMotoristas } from "../../services/motorista";
import { ICreateMotorista, IMotorista } from "../../interfaces/motorista";
import { ICreatePlaca, IPlaca } from "../../interfaces/placa";
import { createPlaca, getAllPlacas } from "../../services/placa";
import { ICreateEmpresa, IEmpresa } from "../../interfaces/empresa";
import { createEmpresa, getAllEmpresas } from "../../services/empresa";

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

  const [empresas, setEmpresas] = useState<IEmpresa[]>();
  const [empresaQuery, setEmpresaQuery] = useState("");
  const [showEmpresaDropdown, setShowEmpresaDropdown] = useState(false);

  const [placas, setPlacas] = useState<IPlaca[]>();
  const [placasQuery, setPlacasQuery] = useState("");
  const [showPlacasDropdown, setShowPlacasDropdown] = useState(false);

  const [motoristas, setMotoristas] = useState<IMotorista[]>();
  const [motoristaQuery, setMotoristaQuery] = useState("");

  const [allRgCpf, setAllRgCpf] = useState<string[]>([]);
  const [allRgCpfQuery, setAllRgCpfQuery] = useState("");
  const [showAllRgCpfDropdown, setShowAllRgCpfDropdown] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        showLoading();
        const getEmpresas: IEmpresa[] = await getAllEmpresas();

        const ordemAlfabeticaEmpresas = [...getEmpresas].sort((a, b) =>
          a.nome.localeCompare(b.nome),
        );

        setEmpresas(ordemAlfabeticaEmpresas);

        const getMotoristas = await getAllMotoristas();

        setAllRgCpf(getMotoristas.map((m) => m.rgCpf));

        const ordemAlfabeticaMotoristas = [...getMotoristas].sort((a, b) =>
          a.nome.localeCompare(b.nome),
        );

        setMotoristas(ordemAlfabeticaMotoristas);

        const getPlacas = await getAllPlacas();

        const ordemAlfabeticaPlacas = [...getPlacas].sort((a, b) =>
          a.placa.localeCompare(b.placa),
        );

        setPlacas(ordemAlfabeticaPlacas);
      } catch (erro: any) {
        alert(erro.message);
      } finally {
        hideLoading();
      }
    };

    getData();
  }, []);

  const empresasFiltradas = useMemo(() => {
    if (!empresaQuery) return empresas ?? [];

    return empresas?.filter((e) =>
      e.nome.toLowerCase().includes(empresaQuery.toLowerCase()),
    );
  }, [empresaQuery, empresas]);

  const placasFiltrados = useMemo(() => {
    if (!placasQuery) return placas ?? [];

    return placas?.filter((m) =>
      m.placa.toLowerCase().includes(placasQuery.toLowerCase()),
    );
  }, [placasQuery, placas]);

  const allRgCpfFiltradas = useMemo(() => {
    if (!allRgCpfQuery) return allRgCpf ?? [];

    return allRgCpf?.filter((e) =>
      e.toLowerCase().includes(allRgCpfQuery.toLowerCase()),
    );
  }, [allRgCpfQuery, allRgCpf]);

  const createCarga = async () => {
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

      const empresa: ICreateEmpresa = {
        nome: form.empresa,
        ativo: true,
      };

      const motorista: ICreateMotorista = {
        nome: form.motorista,
        rgCpf: form.rgCpf,
        celular: form.celular,
      };

      const placa: ICreatePlaca = {
        placa: form.placa,
      };

      const resultado = await createNovaCarga(carga);

      await createEmpresa(empresa);
      await createMotorista(motorista);
      await createPlaca(placa);
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
  };

  return (
    <View style={globalStyles.formContainer}>
      <View style={[globalStyles.formRow, { zIndex: 999 }]}>
        {/* Chegada */}
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

        {/* Empresa */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText}>EMPRESA*</Text>

          <TextInput
            style={globalStyles.input}
            value={empresaQuery}
            onChangeText={(text) => {
              setEmpresaQuery(text);
              updateField("empresa", text);
              setShowEmpresaDropdown(true);
            }}
            onFocus={() => setShowEmpresaDropdown(true)}
            onBlur={() => {
              setTimeout(() => setShowEmpresaDropdown(false), 100);
            }}
          />

          {showEmpresaDropdown &&
            empresasFiltradas &&
            empresasFiltradas.length > 0 && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  backgroundColor: "white",
                  position: "absolute",
                  top: 95,
                  width: "95%",
                  zIndex: 999,
                  maxHeight: 180,
                }}
              >
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {empresasFiltradas.map((empresa) => (
                    <Pressable
                      key={empresa.id}
                      style={{ padding: 10 }}
                      onPress={() => {
                        updateField("empresa", empresa.nome);
                        setEmpresaQuery(empresa.nome);
                        setShowEmpresaDropdown(false);
                      }}
                    >
                      <Text>{empresa.nome}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
        </View>

        {/* Placa */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText}>PLACA*</Text>

          <MaskedTextInput
            style={globalStyles.input}
            value={placasQuery}
            placeholder="AAA-****"
            placeholderTextColor={colors.gray}
            mask="AAA-SSSS"
            onChangeText={(text) => {
              setPlacasQuery(text.toUpperCase());
              updateField("placa", text.toUpperCase());
              setShowPlacasDropdown(true);
            }}
            onFocus={() => setShowPlacasDropdown(true)}
            onBlur={() => {
              setTimeout(() => setShowPlacasDropdown(false), 100);
            }}
          />

          {showPlacasDropdown &&
            placasFiltrados &&
            placasFiltrados.length > 0 && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  backgroundColor: "white",
                  position: "absolute",
                  top: 95,
                  width: "95%",
                  zIndex: 999,
                  maxHeight: 180,
                }}
              >
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {placasFiltrados.map((placa) => (
                    <Pressable
                      key={placa.id}
                      style={{ padding: 10 }}
                      onPress={() => {
                        updateField("placa", placa.placa);
                        setPlacasQuery(placa.placa);
                        setShowPlacasDropdown(false);
                      }}
                    >
                      <Text>{placa.placa}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
        </View>
      </View>

      <View style={[globalStyles.formRow, { zIndex: 998 }]}>
        {/* RG/CPF */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            RG/CPF*
          </Text>

          <TextInput
            style={globalStyles.input}
            value={allRgCpfQuery}
            onChangeText={(text) => {
              setAllRgCpfQuery(text);
              updateField("rgCpf", text);
              setShowAllRgCpfDropdown(true);
            }}
            onFocus={() => setShowAllRgCpfDropdown(true)}
            onBlur={() => {
              setTimeout(() => setShowAllRgCpfDropdown(false), 100);
            }}
          />

          {showAllRgCpfDropdown &&
            allRgCpfFiltradas &&
            allRgCpfFiltradas.length > 0 && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  backgroundColor: "white",
                  position: "absolute",
                  top: 95,
                  width: "95%",
                  zIndex: 999,
                  maxHeight: 180,
                }}
              >
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {allRgCpfFiltradas.map((rgCpf) => (
                    <Pressable
                      key={rgCpf}
                      style={{ padding: 10 }}
                      onPress={() => {
                        setAllRgCpfQuery(rgCpf);
                        updateField("rgCpf", rgCpf);

                        // encontrar motorista pelo RG
                        const motorista = motoristas?.find(
                          (m) => m.rgCpf === rgCpf,
                        );

                        if (motorista) {
                          updateField("motorista", motorista.nome);
                          setMotoristaQuery(motorista.nome);
                          updateField(
                            "celular",
                            motorista.celular || "",
                          );
                        }

                        setShowAllRgCpfDropdown(false);
                      }}
                    >
                      <Text>{rgCpf}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
        </View>

        {/* Motorista */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText}>MOTORISTA*</Text>

          <TextInput
            style={globalStyles.input}
            value={motoristaQuery}
            onChangeText={(text) => {
              setMotoristaQuery(text);
              updateField("motorista", text);
            }}
          />
        </View>

        {/* Celular */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            CELULAR
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
        {/* Nº Nota Fiscal */}
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
          onPress={async () => createCarga()}
        />
      </View>
    </View>
  );
}
