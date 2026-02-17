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
import {
  createMotorista,
  getAllMotoristas,
  getMotoristaPorRgCpf,
} from "../../services/motorista";
import { IMotorista } from "../../interfaces/motorista";
import { IPlaca } from "../../interfaces/placa";
import { createPlaca, getAllPlacas, getPlaca } from "../../services/placa";
import { IEmpresa } from "../../interfaces/empresa";
import {
  createEmpresa,
  getAllEmpresas,
  getEmpresa,
} from "../../services/empresa";

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

  const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
  const [placas, setPlacas] = useState<IPlaca[]>([]);
  const [motoristas, setMotoristas] = useState<IMotorista[]>([]);
  const [allRgCpf, setAllRgCpf] = useState<string[]>([]);

  const [dropdowns, setDropdowns] = useState({
    empresa: false,
    placa: false,
    rgCpf: false,
  });

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
    if (!form.empresa) return empresas ?? [];

    return empresas?.filter((e) =>
      e.nome.toLowerCase().includes(form.empresa.toLowerCase()),
    );
  }, [form.empresa, empresas]);

  const placasFiltrados = useMemo(() => {
    if (!form.placa) return placas ?? [];

    return placas?.filter((m) =>
      m.placa.toLowerCase().includes(form.placa.toLowerCase()),
    );
  }, [form.placa, placas]);

  const allRgCpfFiltradas = useMemo(() => {
    if (!form.rgCpf) return allRgCpf ?? [];

    return allRgCpf?.filter((e) =>
      e.toLowerCase().includes(form.rgCpf.toLowerCase()),
    );
  }, [form.rgCpf, allRgCpf]);

  const [errors, setErrors] = useState<{
    empresa?: string;
    placa?: string;
    motorista?: string;
    rgCpf?: string;
    chegada?: string;
    tipoOperacao?: string;
  }>({
    empresa: " ",
    placa: " ",
    motorista: " ",
    rgCpf: " ",
    chegada: " ",
    tipoOperacao: " ",
  });

  const validarFormulario = () => {
    const novosErros: typeof errors = {};

    if (!form.chegada) novosErros.chegada = "Data de chegada é obrigatória.";

    if (!form.empresa.trim())
      novosErros.empresa = "Nome da empresa é obrigatório.";

    if (!form.placa.trim()) novosErros.placa = "Placa é obrigatória.";

    if (!form.rgCpf.trim())
      novosErros.rgCpf = "RG ou CPF do motorista é obrigatório.";

    if (!form.motorista.trim())
      novosErros.motorista = "Nome do motorista é obrigatório.";

    if (form.tipoOperacao === 0)
      novosErros.tipoOperacao = "Selecione a operação.";

    setErrors(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const createCarga = async () => {
    console.log("1");
    try {
      showLoading();
      console.log("2");
      console.log(form);
      if (!validarFormulario()) return;
      console.log("3");

      // ===== EMPRESA =====
      let empresa = await getEmpresa(form.empresa.trim().toUpperCase());

      if (!empresa) {
        empresa = await createEmpresa({
          nome: form.empresa.trim().toUpperCase(),
          ativo: true,
        });
        console.log(empresa);
      }

      // ===== MOTORISTA =====
      let motorista = await getMotoristaPorRgCpf(
        form.rgCpf.trim().toUpperCase(),
      );

      if (!motorista) {
        motorista = await createMotorista({
          nome: form.motorista.trim().toUpperCase(),
          rgCpf: form.rgCpf.trim().toUpperCase(),
          celular: form.celular,
        });
      }

      // ===== PLACA =====
      let placa = await getPlaca(form.placa.trim().toUpperCase());

      if (!placa) {
        placa = await createPlaca({
          placa: form.placa.trim().toUpperCase(),
        });
      }

      // ===== CARGA =====
      const carga: INovaCarga = {
        chegada: new Date(form.chegada),
        empresaId: empresa.id,
        motoristaId: motorista.id,
        placaId: placa.id,
        numeroNotaFiscal: form.numeroNotaFiscal?.trim().toUpperCase(),
        tipoOperacao: form.tipoOperacao,
      };

      await createNovaCarga(carga);

      alert("Carga salva com sucesso!");

      router.push({
        pathname: "/main",
        params: {
          pageName: "operacoes",
          subPage: "novaCarga",
        },
      });
    } catch (erro: any) {
      if (erro.message === "Empresa não encontrada") alert("aqui ó");
      alert(erro.message);
      console.warn(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <View
      style={[
        globalStyles.mainContainer,
        { flexDirection: "column", margin: 24, padding: 24 },
      ]}
    >
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
          <Text style={globalStyles.errorText} selectable={false}>
            {errors.chegada ?? " "}
          </Text>
        </View>

        {/* Empresa */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText}>EMPRESA*</Text>

          <TextInput
            style={globalStyles.input}
            value={form.empresa}
            onChangeText={(text) => {
              updateField("empresa", text.toUpperCase());
            }}
            onFocus={() => setDropdowns((prev) => ({ ...prev, empresa: true }))}
            onBlur={() =>
              setTimeout(() => {
                setDropdowns((prev) => ({ ...prev, empresa: false }));
              }, 150)
            }
          />
          <Text style={globalStyles.errorText} selectable={false}>
            {errors.empresa ?? " "}
          </Text>

          {dropdowns.empresa &&
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
                        setDropdowns((prev) => ({ ...prev, empresa: false }));
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

          <TextInput
            style={globalStyles.input}
            value={form.placa}
            placeholder="AAA-****"
            placeholderTextColor={colors.gray}
            maxLength={8}
            onChangeText={(text) => {
              let value = text.toUpperCase();

              // remove tudo que não for letra ou número
              value = value.replace(/[^A-Z0-9]/g, "");

              // primeiras 3 só letras
              const letras = value.slice(0, 3).replace(/[^A-Z]/g, "");

              // resto letras ou números
              const resto = value.slice(3, 7);

              let formatado = letras;

              if (resto.length > 0) {
                formatado += "-" + resto;
              }

              updateField("placa", formatado);
            }}
            onFocus={() => setDropdowns((prev) => ({ ...prev, placa: true }))}
            onBlur={() =>
              setTimeout(() => {
                setDropdowns((prev) => ({ ...prev, placa: false }));
              }, 150)
            }
          />
          <Text style={globalStyles.errorText} selectable={false}>
            {errors.placa ?? " "}
          </Text>

          {dropdowns.placa && placasFiltrados && placasFiltrados.length > 0 && (
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
                      setDropdowns((prev) => ({ ...prev, placa: false }));
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
            value={form.rgCpf}
            onChangeText={(text) => {
              updateField("rgCpf", text.toUpperCase());
            }}
            onFocus={() => setDropdowns((prev) => ({ ...prev, rgCpf: true }))}
            onBlur={() =>
              setTimeout(() => {
                setDropdowns((prev) => ({ ...prev, rgCpf: false }));
              }, 150)
            }
          />
          <Text style={globalStyles.errorText} selectable={false}>
            {errors.rgCpf ?? " "}
          </Text>

          {dropdowns.rgCpf &&
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
                        updateField("rgCpf", rgCpf);

                        // encontrar motorista pelo RG
                        const motorista = motoristas?.find(
                          (m) => m.rgCpf === rgCpf,
                        );

                        if (motorista) {
                          updateField("motorista", motorista.nome);
                          updateField("celular", motorista.celular || "");
                        }

                        setDropdowns((prev) => ({ ...prev, rgCpf: false }));
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
            value={form.motorista}
            onChangeText={(text) => {
              updateField("motorista", text.toUpperCase());
            }}
          />
          <Text style={globalStyles.errorText} selectable={false}>
            {errors.motorista ?? " "}
          </Text>
        </View>

        {/* Celular */}
        <View style={globalStyles.labelInputContainer}>
          <Text style={globalStyles.labelText} selectable={false}>
            CELULAR
          </Text>
          <TextInput
            placeholder="(99) 99999-9999"
            placeholderTextColor={colors.gray}
            style={globalStyles.input}
            keyboardType={Platform.OS === "web" ? "default" : "numeric"}
            value={form.celular}
            maxLength={15}
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

              updateField("celular", value);
            }}
          />
          <Text style={globalStyles.errorText} selectable={false}>
            {" "}
          </Text>
        </View>
      </View>

      <View style={globalStyles.formRow}>
        {/* Nº Nota Fiscal */}
        <View style={[globalStyles.labelInputContainer, { flex: 2.1 }]}>
          <Text style={globalStyles.labelText} selectable={false}>
            Nº DA NOTA FISCAL
          </Text>
          <TextInput
            style={globalStyles.input}
            value={form.numeroNotaFiscal}
            onChangeText={(text) =>
              updateField("numeroNotaFiscal", text.toUpperCase())
            }
          />
          <Text style={globalStyles.errorText} selectable={false}>
            {" "}
          </Text>
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
          <Text style={globalStyles.errorText} selectable={false}>
            {errors.tipoOperacao ?? " "}
          </Text>
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
