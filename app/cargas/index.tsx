import {
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import MenuOptionButton from "../_components/MenuOptionButton";
import { dataInputStyle, getGlobalStyles } from "../../globalStyles";
import { colors } from "../../colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ICarga,
  IUpdateCargaForm,
  ICargaFormatada,
  INovaCarga,
} from "../../interfaces/carga";
import {
  createNovaCarga,
  deleteCarga,
  getCargas,
  updateCarga,
} from "../../services/cargas";
import { useLoading } from "../../context/providers/loading";
import EditModal from "../_components/SimpleModal";
import DeleteModal from "../_components/SimpleModal";
import { useAuth } from "../../context/auth";
import { socket } from "../../services/httpclient";
import { IJwtPayload } from "../../interfaces/jwt";
import React from "react";

const widthIdColumn: number = 0.6;

function formatarCarga(carga: ICarga): ICargaFormatada {
  const chegadaDate = new Date(carga.chegada);
  const entradaDate = carga.entrada ? new Date(carga.entrada) : null;
  const saidaDate = carga.saida ? new Date(carga.saida) : null;

  return {
    ...carga,
    chegada: chegadaDate,
    entrada: entradaDate,
    saida: saidaDate,

    chegadaDataStr: chegadaDate.toLocaleDateString(),

    chegadaHoraStr: chegadaDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    entradaHoraStr: entradaDate
      ? entradaDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--",

    saidaHoraStr: saidaDate
      ? saidaDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--",
  };
}

const renderTableHeader = (
  usuario: IJwtPayload | null,
  globalStyles: ReturnType<typeof getGlobalStyles>,
) => {
  return (
    <View
      style={[globalStyles.mainContainer, { height: 70, alignItems: "center" }]}
    >
      <Text style={[globalStyles.tableHeader, { flex: widthIdColumn }]}>
        ID
      </Text>
      <Text style={globalStyles.tableHeader}>DATA</Text>
      <Text style={globalStyles.tableHeader}>HORÁRIOS</Text>
      <Text style={globalStyles.tableHeader}>EMPRESA</Text>
      <Text style={globalStyles.tableHeader}>PLACA</Text>
      <Text style={globalStyles.tableHeader}>MOTORISTA</Text>
      <Text style={globalStyles.tableHeader}>RG/CPF MOTORISTA</Text>
      <Text style={globalStyles.tableHeader}>CELULAR</Text>
      <Text style={globalStyles.tableHeader}>Nº NF</Text>
      <Text style={globalStyles.tableHeader}>C/D</Text>
      {(usuario?.nivelDeAcesso === 1 || usuario?.nivelDeAcesso === 2) && (
        <Text style={globalStyles.tableHeader}>AÇÕES</Text>
      )}
    </View>
  );
};

const CargaRow = React.memo(
  ({
    carga,
    usuario,
    globalStyles,
    onEdit,
    onDelete,
  }: {
    carga: ICargaFormatada;
    usuario: IJwtPayload | null;
    globalStyles: ReturnType<typeof getGlobalStyles>;
    onEdit: (c: ICarga) => void;
    onDelete: (c: ICarga) => void;
  }) => {
    return (
      <View style={globalStyles.tableRegister}>
        <View style={[globalStyles.tableColumn, { flex: widthIdColumn }]}>
          <Text style={globalStyles.tableColumnText}>{carga.id}</Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>
            {carga.chegadaDataStr}
          </Text>
        </View>
        <View
          style={[
            globalStyles.tableColumn,
            {
              alignItems: "stretch",
            },
          ]}
        >
          <View style={[globalStyles.tableDataRow]}>
            <Text
              style={[
                globalStyles.tableColumnText,
                globalStyles.tableDataRowText,
                { textAlign: "left" },
              ]}
            >
              Chegada:
            </Text>
            <Text
              style={[
                globalStyles.tableColumnText,
                globalStyles.tableDataRowText,
                { textAlign: "right" },
              ]}
            >
              {carga.chegadaHoraStr}
            </Text>
          </View>
          <View style={[globalStyles.tableDataRow]}>
            <Text
              style={[
                globalStyles.tableColumnText,
                globalStyles.tableDataRowText,
                { textAlign: "left" },
              ]}
            >
              Entrada:
            </Text>
            <Text
              style={[
                globalStyles.tableColumnText,
                globalStyles.tableDataRowText,
                { textAlign: "right" },
              ]}
            >
              {carga.entradaHoraStr}
            </Text>
          </View>
          <View style={[globalStyles.tableDataRow, { borderBottomWidth: 0 }]}>
            <Text
              style={[
                globalStyles.tableColumnText,
                globalStyles.tableDataRowText,
                { textAlign: "left" },
              ]}
            >
              Saída:
            </Text>
            <Text
              style={[
                globalStyles.tableColumnText,
                globalStyles.tableDataRowText,
                { textAlign: "right" },
              ]}
            >
              {carga.saidaHoraStr}
            </Text>
          </View>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>{carga.empresa}</Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>{carga.placa}</Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>{carga.motorista}</Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>{carga.rgCpf}</Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>{carga.celular}</Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text
            style={globalStyles.tableColumnText}
            numberOfLines={10}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {carga.numeroNotaFiscal ? carga.numeroNotaFiscal : "S/NF"}
          </Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={[globalStyles.tableColumnText, { fontSize: 20 }]}>
            {carga.tipoOperacao === 1 ? "Carregamento" : "Descarregamento"}
          </Text>
        </View>

        {(usuario?.nivelDeAcesso === 1 || usuario?.nivelDeAcesso === 2) && (
          <View
            style={[
              globalStyles.tableColumn,
              { flexDirection: "row", gap: 20 },
            ]}
          >
            <MenuOptionButton
              containerStyle={{
                backgroundColor: "#4CA64C",
                paddingHorizontal: 10,
                paddingVertical: 7,
                borderRadius: 10,
              }}
              label={<Feather name="edit" size={35} color="white" />}
              onPress={() => onEdit(carga)}
            />

            <MenuOptionButton
              containerStyle={{
                backgroundColor: colors.red,
                paddingHorizontal: 13,
                paddingVertical: 8,
                borderRadius: 10,
              }}
              label={<FontAwesome name="trash-o" size={37} color="white" />}
              onPress={() => onDelete(carga)}
            />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  dataHorarioContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
  },
  button: {
    minWidth: 130,
    maxHeight: 50,
  },
  buttonFiltrar: {
    backgroundColor: colors.lightBlue,
  },
  buttonLimpar: {
    borderWidth: 2,
    borderColor: colors.gray,
  },
  buttonLabel: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tipoOperacaoFiltroContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
  },
  radioLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.lightBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.lightBlue,
  },
});

export default function Cargas() {
  const { usuario } = useAuth();
  const globalStyles = useMemo(() => getGlobalStyles(), []);
  const { showLoading, hideLoading } = useLoading();

  const [cargas, setCargas] = useState<ICargaFormatada[]>([]);
  const [cargaSelecionada, setCargaSelecionada] = useState<ICarga>();
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);

  const [horarios, setHorarios] = useState<IUpdateCargaForm>({
    chegada: "",
    entrada: "",
    saida: "",
  });

  // Filtros
  const [dataInicial, setDataInicial] = useState("");
  const [horarioInicial, setHorarioInicial] = useState("00:00");
  const [dataFinal, setDataFinal] = useState("");
  const [horarioFinal, setHorarioFinal] = useState("23:59");
  const [id, setId] = useState<string>("");
  const [empresa, setEmpresa] = useState<string>("");
  const [rgCpf, setRgCpf] = useState<string>("");
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [cargasFiltradas, setCargasFiltradas] = useState<ICargaFormatada[]>([]);
  // 0 = todos, 1 = carregamento, 2 = descarregamento
  const [tipoOperacaoFiltro, setTipoOperacaoFiltro] = useState<0 | 1 | 2>(0);
  const temFiltroAtivo = useMemo(() => {
    return (
      dataInicial !== "" ||
      dataFinal !== "" ||
      id.trim() !== "" ||
      empresa.trim() !== "" ||
      rgCpf.trim() !== "" ||
      numeroNotaFiscal.trim() !== "" ||
      tipoOperacaoFiltro !== 0
    );
  }, [
    dataInicial,
    dataFinal,
    id,
    empresa,
    rgCpf,
    numeroNotaFiscal,
    tipoOperacaoFiltro,
  ]);

  const filtrar = () => {
    let resultado = [...cargas];

    resultado = resultado.filter((c) => {
      // PERÍODO
      const inicio =
        dataInicial && horarioInicial
          ? juntarDataHora(parseDateLocal(dataInicial), horarioInicial)
          : null;

      const fim =
        dataFinal && horarioFinal
          ? juntarDataHora(parseDateLocal(dataFinal), horarioFinal)
          : null;

      if (inicio && c.chegada < inicio) return false;
      if (fim && c.chegada > fim) return false;

      // ID
      if (id && !c.id.toString().includes(id.trim())) return false;

      // EMPRESA
      if (
        empresa &&
        !c.empresa.toLowerCase().includes(empresa.trim().toLowerCase())
      )
        return false;

      // RG / CPF
      if (rgCpf && !c.rgCpf.toLowerCase().includes(rgCpf.trim().toLowerCase()))
        return false;

      // NOTA FISCAL
      if (
        numeroNotaFiscal &&
        !(c.numeroNotaFiscal ?? "")
          .toLowerCase()
          .includes(numeroNotaFiscal.trim().toLowerCase())
      )
        return false;

      // TIPO OPERAÇÃO
      if (tipoOperacaoFiltro !== 0 && c.tipoOperacao !== tipoOperacaoFiltro)
        return false;

      return true;
    });

    setCargasFiltradas(resultado);
  };

  const limparFiltro = () => {
    setDataInicial("");
    setDataFinal("");
    setHorarioInicial("00:00");
    setHorarioFinal("23:59");
    setId("");
    setEmpresa("");
    setRgCpf("");
    setNumeroNotaFiscal("");
    setTipoOperacaoFiltro(0);

    setCargasFiltradas(cargas);
  };

  const getData = useCallback(async () => {
    try {
      showLoading();
      const resultado: ICarga[] = await getCargas();

      const ordemDescrescente = [...resultado].sort((a, b) => b.id - a.id);

      const formatadas = ordemDescrescente.map(formatarCarga);

      setCargas(formatadas);
      setCargasFiltradas(formatadas);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    filtrar();
  }, [
    dataInicial,
    dataFinal,
    horarioInicial,
    horarioFinal,
    id,
    empresa,
    rgCpf,
    numeroNotaFiscal,
    tipoOperacaoFiltro,
    cargas,
  ]);

  useEffect(() => {
    getData();

    const handleCargaAtualizada = () => {
      getData();
    };

    socket.on("cargaAtualizada", handleCargaAtualizada);

    socket.on("connect_error", (erro: any) => {
      alert(erro.message);
    });

    return () => {
      socket.off("cargaAtualizada", handleCargaAtualizada);
      socket.off("connect_error");
    };
  }, []);

  const tableHeader = useMemo(
    () => renderTableHeader(usuario, globalStyles),
    [usuario, globalStyles],
  );

  const handleEdit = useCallback((carga: ICarga) => {
    setCargaSelecionada(carga);

    setHorarios({
      chegada: carga.chegada.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      entrada: carga.entrada
        ? carga.entrada.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      saida: carga.saida
        ? carga.saida.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    });

    setIsEditModalVisible(true);
  }, []);

  const handleDeletePress = useCallback((carga: ICarga) => {
    setCargaSelecionada(carga);
    setIsDeleteModalVisible(true);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      showLoading();
      const resultado = await deleteCarga(id);

      hideLoading();
      setIsDeleteModalVisible(false);

      alert("Carga excluída com sucesso!");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const atualizarCarga = async () => {
    try {
      showLoading();
      if (!cargaSelecionada) return;

      const resultado = await updateCarga(
        {
          chegada: juntarDataHora(cargaSelecionada.chegada, horarios.chegada),
          entrada: horarios.entrada
            ? juntarDataHora(cargaSelecionada.chegada, horarios.entrada)
            : null,
          saida: horarios.saida
            ? juntarDataHora(cargaSelecionada.chegada, horarios.saida)
            : null,
        },
        cargaSelecionada.id,
      );
      hideLoading();
      setIsEditModalVisible(false);

      alert("Horário atualizado com sucesso!");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const vaiCarregar = async () => {
    try {
      showLoading();
      if (!cargaSelecionada) return;

      const carga: INovaCarga = {
        chegada: juntarDataHora(cargaSelecionada.chegada, horarios.saida),
        entrada: juntarDataHora(cargaSelecionada.chegada, horarios.saida),
        empresa: cargaSelecionada.empresa,
        placa: cargaSelecionada.placa,
        motorista: cargaSelecionada.motorista,
        rgCpf: cargaSelecionada.rgCpf,
        celular: cargaSelecionada.celular,
        tipoOperacao: 1,
      };

      const resultado = await createNovaCarga(carga);

      await atualizarCarga();

      hideLoading();
      setIsEditModalVisible(false);

      alert("Novo carregamento criado com sucesso!");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <View style={{ margin: 24, gap: 20, flex: 1 }}>
        {/* FILTRO CONTAINER */}
        <View style={globalStyles.mainContainer}>
          <View style={globalStyles.filtroContainer}>
            <View style={globalStyles.filtroContainerRow}>
              <View style={styles.dataHorarioContainer}>
                <View style={globalStyles.dataLabelInputContainer}>
                  <View style={globalStyles.dataLabelContainer}>
                    <FontAwesome name="calendar-o" size={24} color="black" />
                    <Text style={globalStyles.dataLabelText} selectable={false}>
                      Data Inicial
                    </Text>
                  </View>
                  <input
                    type="date"
                    style={dataInputStyle}
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                  />
                </View>
                <View style={globalStyles.dataLabelInputContainer}>
                  <View style={globalStyles.dataLabelContainer}>
                    <Feather name="clock" size={24} color="black" />
                    <Text style={globalStyles.dataLabelText} selectable={false}>
                      Horário de chegada
                    </Text>
                  </View>
                  <input
                    type="time"
                    style={dataInputStyle}
                    value={horarioInicial}
                    onChange={(e) => setHorarioInicial(e.target.value)}
                  />
                </View>
              </View>

              <View style={styles.dataHorarioContainer}>
                <View style={globalStyles.dataLabelInputContainer}>
                  <View style={globalStyles.dataLabelContainer}>
                    <FontAwesome name="calendar-o" size={24} color="black" />
                    <Text style={globalStyles.dataLabelText} selectable={false}>
                      Data Final
                    </Text>
                  </View>
                  <input
                    type="date"
                    style={dataInputStyle}
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                  />
                </View>
                <View style={globalStyles.dataLabelInputContainer}>
                  <View style={globalStyles.dataLabelContainer}>
                    <Feather name="clock" size={24} color="black" />
                    <Text style={globalStyles.dataLabelText} selectable={false}>
                      Horário final
                    </Text>
                  </View>
                  <input
                    type="time"
                    style={dataInputStyle}
                    value={horarioFinal}
                    onChange={(e) => setHorarioFinal(e.target.value)}
                  />
                </View>
              </View>
            </View>

            <View style={globalStyles.filtroContainerRow}>
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <FontAwesome name="id-badge" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    ID
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={id}
                  onChangeText={(text) => setId(text)}
                />
              </View>

              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <FontAwesome6 name="industry" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    Empresa
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={empresa}
                  onChangeText={(text) => setEmpresa(text)}
                />
              </View>

              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <FontAwesome name="id-card-o" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    RG/CPF - Motorista
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={rgCpf}
                  onChangeText={(text) => setRgCpf(text)}
                />
              </View>

              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="black"
                  />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    Nº NF
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={numeroNotaFiscal}
                  onChangeText={(text) => setNumeroNotaFiscal(text)}
                />
              </View>
            </View>

            {/* Limpar Filtro Container */}
            <View
              style={[
                globalStyles.filtroContainerRow,
                { justifyContent: "space-between", marginTop: -10 },
              ]}
            >
              <View style={styles.tipoOperacaoFiltroContainer}>
                {/* TODOS */}
                <Pressable
                  style={styles.radioLabelContainer}
                  onPress={() => setTipoOperacaoFiltro(0)}
                >
                  <View style={styles.radioButton}>
                    {tipoOperacaoFiltro === 0 && (
                      <View style={styles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      tipoOperacaoFiltro === 0
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    Todos
                  </Text>
                </Pressable>

                {/* CARREGAMENTO */}
                <Pressable
                  style={styles.radioLabelContainer}
                  onPress={() => setTipoOperacaoFiltro(1)}
                >
                  <View style={styles.radioButton}>
                    {tipoOperacaoFiltro === 1 && (
                      <View style={styles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      tipoOperacaoFiltro === 1
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    Carregamento
                  </Text>
                </Pressable>

                {/* DESCARREGAMENTO */}
                <Pressable
                  style={styles.radioLabelContainer}
                  onPress={() => setTipoOperacaoFiltro(2)}
                >
                  <View style={styles.radioButton}>
                    {tipoOperacaoFiltro === 2 && (
                      <View style={styles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      tipoOperacaoFiltro === 2
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    Descarregamento
                  </Text>
                </Pressable>
              </View>

              {/* Limpar filtro */}
              <MenuOptionButton
                containerStyle={[
                  globalStyles.button,
                  styles.button,
                  {
                    borderWidth: temFiltroAtivo ? 3 : 2,
                    borderColor: temFiltroAtivo ? colors.red : colors.gray,
                  },
                ]}
                labelStyle={globalStyles.buttonText}
                label={
                  <View style={styles.buttonLabel}>
                    <MaterialCommunityIcons
                      name="cancel"
                      size={24}
                      color={temFiltroAtivo ? colors.red : colors.gray}
                    />
                    <Text
                      style={
                        temFiltroAtivo
                          ? { color: colors.red, fontWeight: 700 }
                          : { color: colors.gray }
                      }
                    >
                      Limpar filtro
                    </Text>
                  </View>
                }
                onPress={limparFiltro}
              />
            </View>
          </View>
        </View>

        <FlatList
          data={cargasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => tableHeader}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews
          renderItem={({ item }) => (
            <CargaRow
              carga={item}
              usuario={usuario}
              globalStyles={globalStyles}
              onEdit={handleEdit}
              onDelete={handleDeletePress}
            />
          )}
          style={[
            globalStyles.mainContainer,
            {
              flexDirection: "column",
              padding: 0,
              flexGrow: 0,
            },
          ]}
        />
      </View>

      {/* <EditModal /> */}
      {isEditModalVisible && (
        <EditModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          title="Editar carga"
        >
          <Text style={globalStyles.labelText}>Chegada</Text>
          <input
            type="time"
            style={dataInputStyle}
            value={horarios.chegada}
            onChange={(e) =>
              setHorarios((prev) => ({
                ...prev,
                chegada: e.target.value,
              }))
            }
          />

          <Text style={globalStyles.labelText}>Entrada</Text>
          <input
            type="time"
            style={{
              ...dataInputStyle,
              ...(!horarios.chegada && { opacity: 0.6, cursor: "not-allowed" }),
            }}
            disabled={horarios.chegada == ""}
            value={horarios.entrada}
            onChange={(e) =>
              setHorarios((prev) => ({
                ...prev,
                entrada: e.target.value,
              }))
            }
          />

          <Text style={globalStyles.labelText}>Saída</Text>
          <input
            type="time"
            style={{
              ...dataInputStyle,
              ...(!horarios.entrada && { opacity: 0.6, cursor: "not-allowed" }),
            }}
            disabled={horarios.entrada == ""}
            value={horarios.saida}
            onChange={(e) =>
              setHorarios((prev) => ({
                ...prev,
                saida: e.target.value,
              }))
            }
          />

          {/* Salvar */}
          <MenuOptionButton
            containerStyle={[
              globalStyles.button,
              { backgroundColor: colors.green },
            ]}
            labelStyle={globalStyles.buttonText}
            label={
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Text style={globalStyles.buttonText} selectable={false}>
                  Salvar
                </Text>
                <Feather
                  name="check-circle"
                  size={24}
                  color="white"
                  style={{ marginBottom: -2 }}
                />
              </View>
            }
            onPress={async () => atualizarCarga()}
          />

          {/* Vai carregar */}
          {cargaSelecionada?.tipoOperacao === 2 && (
            <MenuOptionButton
              enabled={
                !!(horarios.chegada && horarios.entrada && horarios.saida)
              }
              containerStyle={[
                globalStyles.button,
                { backgroundColor: colors.lightBlue },
              ]}
              labelStyle={globalStyles.buttonText}
              label={
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <Text style={globalStyles.buttonText} selectable={false}>
                    Vai carregar
                  </Text>
                  <MaterialCommunityIcons
                    name="truck-cargo-container"
                    size={30}
                    color="white"
                    style={{ marginBottom: -5 }}
                  />
                </View>
              }
              onPress={async () => vaiCarregar()}
            />
          )}
        </EditModal>
      )}

      {isDeleteModalVisible && (
        <DeleteModal
          visible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          title="Excluir carga?"
          closeButtonColor={colors.gray}
        >
          <>
            <Text
              style={{ fontSize: 26, fontWeight: "400", textAlign: "center" }}
            >
              Tem certeza que deseja excluir a carga da empresa{" "}
              <Text style={{ fontWeight: "700" }}>
                {cargaSelecionada?.empresa}
              </Text>
              {" ?\n\n"}
              chegada:{" "}
              <Text style={{ fontWeight: "700" }}>
                {cargaSelecionada?.chegada.toLocaleDateString()}
              </Text>
            </Text>

            <MenuOptionButton
              containerStyle={[
                globalStyles.button,
                { backgroundColor: colors.red },
              ]}
              labelStyle={globalStyles.buttonText}
              label={
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text style={globalStyles.buttonText} selectable={false}>
                    Excluir
                  </Text>
                  <Feather name="check-circle" size={24} color="white" />
                </View>
              }
              onPress={async () => {
                if (cargaSelecionada) handleDelete(cargaSelecionada.id);
              }}
            />
          </>
        </DeleteModal>
      )}
    </>
  );
}

function juntarDataHora(dataBase: Date, hora: string) {
  const [h, m] = hora.split(":").map(Number);

  const nova = new Date(dataBase);
  nova.setHours(h);
  nova.setMinutes(m);
  nova.setSeconds(0);
  nova.setMilliseconds(0);

  return nova;
}

function parseDateLocal(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
