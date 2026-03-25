import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { dataInputStyle, getGlobalStyles } from "../../../globalStyles";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IOrcamento,
  IOrcamentoFiltros,
} from "../../../interfaces/comercial/orcamento";
import { colors } from "../../../colors";
import { getAllOrcamentoMaterial } from "../../../services/comercial/orcamentoMaterial";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MenuOptionButton from "../../_components/MenuOptionButton";
import { useLoading } from "../../../context/providers/loading";
import StatusModal from "../../_components/SimpleModal";
import ExportarModal from "../../_components/SimpleModal";
import {
  exportarExcelOrcamentos,
  exportarPDFOrcamentos,
  updateOrcamento,
} from "../../../services/comercial/orcamento";
import { socketOrcamento } from "../../../services/httpclient";
import Picker from "react-native-picker-select";

export default function Orcamentos() {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();
  const [aviso, setAviso] = useState<string>("Carregando...");
  const [isStatusModalVisible, setIsStatusModalVisible] =
    useState<boolean>(false);
  const [isExportarModalVisible, setIsExportarModalVisible] =
    useState<boolean>(false);
  const [tipoExport, setTipoExport] = useState<1 | 2>(1);
  const [motivoRecusa, setMotivoRecusa] = useState<string>("");
  const [motivoRecusaObrigatorioMsg, setMotivoRecusaObrigatorioMsg] =
    useState<string>("Selecione o motivo da recusa.");

  const [orcamentos, setOrcamentos] = useState<IOrcamento[]>([]);
  const [orcamentosFiltrados, setOrcamentosFiltrados] = useState<IOrcamento[]>(
    [],
  );
  const [orcamentoSelecionado, setOrcamentoSelecionado] =
    useState<IOrcamento>();
  const [statusSelecionado, setStatusSelecionado] = useState<string>("");
  const [filtrosVisible, setFiltrosVisible] = useState<boolean>(false);

  const [filtros, setFiltros] = useState<IOrcamentoFiltros>({
    dataInicial: "",
    dataFinal: "",
    id: "",
    enviarPara: "",
    inscricao: "",
    email: "",
    telefone: "",
    departamento: "",
    aosCuidadosDe: "",
    status: "TODOS",
    motivoRecusa: "TODOS",
  });

  const temFiltroAtivo = useMemo(() => {
    return (
      filtros.dataInicial !== "" ||
      filtros.dataFinal !== "" ||
      filtros.id.trim() !== "" ||
      filtros.enviarPara.trim() !== "" ||
      filtros.inscricao.trim() !== "" ||
      filtros.email.trim() !== "" ||
      filtros.telefone.trim() !== "" ||
      filtros.departamento.trim() !== "" ||
      filtros.aosCuidadosDe.trim() !== "" ||
      filtros.status.trim() !== "TODOS" ||
      filtros.motivoRecusa.trim() !== "TODOS"
    );
  }, [
    filtros.dataInicial,
    filtros.dataFinal,
    filtros.id,
    filtros.enviarPara,
    filtros.inscricao,
    filtros.email,
    filtros.telefone,
    filtros.departamento,
    filtros.aosCuidadosDe,
    filtros.status,
    filtros.motivoRecusa,
  ]);

  const filtrar = () => {
    let resultado = [...orcamentos];

    resultado = resultado.filter((orcamento) => {
      // PERÍODO
      const inicio = filtros.dataInicial
        ? juntarDataHora(parseDateLocal(filtros.dataInicial), "00:00")
        : null;

      let fim = filtros.dataFinal
        ? juntarDataHora(parseDateLocal(filtros.dataFinal), "23:59")
        : null;

      if (inicio! > fim!)
        setFiltros((prev) => ({ ...prev, dataFinal: filtros.dataInicial }));

      if (inicio && new Date(orcamento.data) < inicio) return false;
      if (fim && new Date(orcamento.data) > fim) return false;

      // ID
      if (filtros.id && !orcamento.id.toString().includes(filtros.id.trim()))
        return false;

      // ENVIAR PARA
      if (
        filtros.enviarPara &&
        !orcamento.enviarPara
          .toLowerCase()
          .includes(filtros.enviarPara.trim().toLowerCase())
      )
        return false;

      // INSCRIÇÃO
      if (
        filtros.inscricao &&
        !orcamento.inscricao
          .toLowerCase()
          .includes(filtros.inscricao.trim().toLowerCase())
      )
        return false;

      // EMAIL
      if (
        filtros.email &&
        !orcamento.email
          .toLowerCase()
          .includes(filtros.email.trim().toLowerCase())
      )
        return false;

      // TELEFONE
      if (
        filtros.telefone &&
        !(orcamento.telefone ?? "")
          .toLowerCase()
          .includes(filtros.telefone.trim().toLowerCase())
      )
        return false;

      // DEPARTAMENTO
      if (
        filtros.departamento &&
        !(orcamento.departamento ?? "")
          .toLowerCase()
          .includes(filtros.departamento.trim().toLowerCase())
      )
        return false;

      // AOS CUIDADOS DE
      if (
        filtros.aosCuidadosDe &&
        !(orcamento.aosCuidados ?? "")
          .toLowerCase()
          .includes(filtros.aosCuidadosDe.trim().toLowerCase())
      )
        return false;

      // STATUS
      if (
        filtros.status !== "TODOS" &&
        orcamento.status.toLowerCase() !== filtros.status.trim().toLowerCase()
      ) {
        return false;
      }

      // MOTIVO DA RECUSA
      // if (
      //   filtros.motivoRecusa !== "TODOS" &&
      //   orcamento.motivoRecusa.toLowerCase() !==
      //     filtros.motivoRecusa.trim().toLowerCase()
      // ) {
      //   return false;
      // }

      if (filtros.motivoRecusa !== "TODOS" && !orcamento.motivoRecusa) {
        return false;
      }

      if (orcamento.motivoRecusa && filtros.motivoRecusa !== "TODOS") {
        if (
          orcamento.motivoRecusa.trim().toLowerCase() !==
          filtros.motivoRecusa.trim().toLowerCase()
        ) {
          return false;
        }
      }

      return true;
    });

    setOrcamentosFiltrados(resultado);
  };

  useEffect(() => {
    filtrar();
  }, [
    filtros.dataInicial,
    filtros.dataFinal,
    filtros.id,
    filtros.enviarPara,
    filtros.inscricao,
    filtros.email,
    filtros.telefone,
    filtros.departamento,
    filtros.aosCuidadosDe,
    filtros.status,
    filtros.motivoRecusa,
    orcamentos,
  ]);

  const limparFiltro = () => {
    setFiltros({
      dataInicial: "",
      dataFinal: "",
      id: "",
      enviarPara: "",
      inscricao: "",
      email: "",
      telefone: "",
      departamento: "",
      aosCuidadosDe: "",
      status: "TODOS",
      motivoRecusa: "TODOS",
    });
  };

  const getData = useCallback(async () => {
    try {
      showLoading();
      const resultado: IOrcamento[] = await getAllOrcamentoMaterial();
      if (resultado.length === 0) {
        setAviso("Não há nenhum orçamento salvo!");
      } else {
        setAviso("Carregando...");
      }

      const resultadoOrdenado = resultado.sort((a, b) => b.id - a.id);

      setOrcamentos(resultadoOrdenado);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    getData();

    const handleOrcamentoAtualizado = () => {
      getData();
    };

    socketOrcamento.on("orcamentoAtualizado", handleOrcamentoAtualizado);

    socketOrcamento.on("connect_error", (erro: any) => {
      alert(erro.message);
    });

    return () => {
      socketOrcamento.off("orcamentoAtualizado", handleOrcamentoAtualizado);
      socketOrcamento.off("connect_error");
    };
  }, []);

  useEffect(() => {
    if (statusSelecionado === "RECUSADO" && !motivoRecusa) {
      setMotivoRecusaObrigatorioMsg("Selecione o motivo da recusa.");
    } else {
      setMotivoRecusaObrigatorioMsg("");
    }
  }, [statusSelecionado, motivoRecusa]);

  useEffect(() => {
    if (filtros.status !== "RECUSADO") {
      setFiltros((prev) => ({ ...prev, motivoRecusa: "TODOS" }));
    }
  }, [filtros.status]);

  const atualizarStatusOrcamento = async () => {
    try {
      showLoading();
      await updateOrcamento(orcamentoSelecionado!.id, {
        status: statusSelecionado,
        motivoRecusa,
      });

      alert("Status do orçamento atualizado com sucesso!");
      setMotivoRecusa("");
      setIsStatusModalVisible(false);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.lightGray,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      gap: 12,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 8,
    },

    orcamentoAceito: {
      backgroundColor: colors.lightGreen,
      color: colors.green,
    },

    orcamentoPendente: {
      backgroundColor: colors.backgroundBlue,
      color: colors.lightBlue,
    },

    orcamentoRecusado: {
      backgroundColor: colors.lightRed,
      color: colors.red,
    },

    id: {
      fontSize: 28,
      fontWeight: "bold",
      color: "black",
    },

    status: {
      fontSize: 28,
      fontWeight: "bold",
      color: "black",
    },

    section: {
      gap: 6,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
    },

    label: {
      fontSize: 26,
      color: "#777",
    },

    value: {
      fontSize: 24,
      fontWeight: "500",
      color: "#333",
    },

    field: {
      width: "32%",
      minWidth: 120,
    },
  });

  const Field = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  const renderOrcamento = (orcamento: IOrcamento) => {
    const orcamentoAceito = orcamento.status === "ACEITO";
    const orcamentoPendente = orcamento.status === "PENDENTE";
    const orcamentoRecusado = orcamento.status === "RECUSADO";

    return (
      <View key={orcamento.id} style={styles.card}>
        {/* HEADER */}
        <View
          style={[
            styles.header,
            orcamentoAceito && styles.orcamentoAceito,
            orcamentoPendente && styles.orcamentoPendente,
            orcamentoRecusado && styles.orcamentoRecusado,
          ]}
        >
          <View>
            <Text
              style={[
                styles.id,
                orcamentoAceito && styles.orcamentoAceito,
                orcamentoPendente && styles.orcamentoPendente,
                orcamentoRecusado && styles.orcamentoRecusado,
              ]}
            >
              Orçamento #{orcamento.id}
            </Text>
            <Text
              style={[
                styles.id,
                orcamentoAceito && styles.orcamentoAceito,
                orcamentoPendente && styles.orcamentoPendente,
                orcamentoRecusado && styles.orcamentoRecusado,
              ]}
            >
              {orcamento.motivoRecusa &&
                `Motivo da recusa: ${orcamento.motivoRecusa}`}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <Text
              style={[
                styles.status,
                orcamentoAceito && styles.orcamentoAceito,
                orcamentoPendente && styles.orcamentoPendente,
                orcamentoRecusado && styles.orcamentoRecusado,
              ]}
            >
              {orcamento.status}
            </Text>
            {/* Editar */}
            <MenuOptionButton
              containerStyle={{
                backgroundColor: "#4CA64C",
                height: 55,
                width: 55,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
              label={<Feather name="edit" size={35} color="white" />}
              onPress={() => {
                setOrcamentoSelecionado(orcamento);
                setStatusSelecionado(orcamento.status);
                setMotivoRecusa(orcamento.motivoRecusa);
                setIsStatusModalVisible(true);
              }}
            />
          </View>
        </View>

        {/* DATA */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Field
              label="Data"
              value={new Date(orcamento.data).toLocaleDateString()}
            />
            <Field label="Enviar para" value={orcamento.enviarPara} />
            <Field label="Inscrição" value={orcamento.inscricao} />
          </View>
        </View>

        {/* CONTATO */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Field label="Email" value={orcamento.email} />
            <Field label="Telefone" value={orcamento.telefone} />
            <Field label="Departamento" value={orcamento.departamento} />
          </View>
        </View>

        {/* EXTRA */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Field label="Aos cuidados de" value={orcamento.aosCuidados} />
          </View>
        </View>

        {/* MATERIAIS TITLE */}
        <View style={[styles.row, { marginTop: 24 }]}>
          <Text style={styles.value}>Materiais</Text>
        </View>

        {/* MATERIAIS */}
        {orcamento.materiais?.map((material, idx) => {
          return (
            <View
              key={material.id}
              style={[styles.section, { marginHorizontal: 36 }]}
            >
              <View
                style={[
                  styles.row,
                  {
                    borderBottomWidth: 1,
                    borderColor: "#b8b8b8",

                    paddingBottom: 12,
                  },
                ]}
              >
                <Field
                  label={`Item ${idx + 1}`}
                  value={`Material: ${material.material.nome}`}
                />
                <Field
                  label=" "
                  value={`Preço: R$ ${String(material.preco).replace(".", ",")}`}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View
      style={[
        globalStyles.mainContainer,
        {
          flexDirection: "column",
          flex: 1,
          margin: 24,
        },
      ]}
    >
      {/* FILTRO CONTAINER */}
      {!filtrosVisible && (
        <Pressable
          style={globalStyles.maximizarFiltroButton}
          onPress={() => setFiltrosVisible(true)}
        >
          <Text style={{ fontWeight: 500, fontSize: 22 }} selectable={false}>
            Filtros
          </Text>
          <AntDesign name="arrow-down" size={20} color="black" />
        </Pressable>
      )}

      {filtrosVisible && (
        <View style={globalStyles.mainContainer}>
          {/* BOTAO MINIMIZAR FILTRO */}
          <Pressable
            style={globalStyles.minimizarFiltroButton}
            onPress={() => setFiltrosVisible(false)}
          >
            <Text
              selectable={false}
              style={{ color: "black", fontWeight: 500 }}
            >
              Minimizar
            </Text>
            <AntDesign name="arrow-up" size={16} color="black" />
          </Pressable>

          <View style={globalStyles.filtroContainer}>
            {/* PRIMEIRA LINHA */}
            <View style={globalStyles.filtroContainerRow}>
              {/* DATA INICIAL */}
              <View style={globalStyles.dataHorarioContainer}>
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
                    value={filtros.dataInicial}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        dataInicial: e.target.value,
                      }))
                    }
                  />
                </View>
              </View>

              {/* DATA FINAL */}
              <View style={globalStyles.dataHorarioContainer}>
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
                    value={filtros.dataFinal}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        dataFinal: e.target.value,
                      }))
                    }
                  />
                </View>
              </View>
            </View>

            {/* SEGUNDA LINHA */}
            <View style={globalStyles.filtroContainerRow}>
              {/* ID */}
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <FontAwesome name="id-badge" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    ID
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={filtros.id}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, id: text }))
                  }
                />
              </View>

              {/* ENVIAR PARA */}
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <FontAwesome name="send" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    Enviar para
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={filtros.enviarPara}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, enviarPara: text }))
                  }
                />
              </View>

              {/* INSCRIÇÃO */}
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <MaterialCommunityIcons
                    name="badge-account-horizontal"
                    size={24}
                    color="black"
                  />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    Inscrição
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={filtros.inscricao}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, inscricao: text }))
                  }
                />
              </View>

              {/* E-MAIL */}
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <MaterialIcons
                    name="alternate-email"
                    size={24}
                    color="black"
                  />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    E-mail
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={filtros.email}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, email: text }))
                  }
                />
              </View>
            </View>

            {/* TERCEIRA LINHA */}
            <View style={globalStyles.filtroContainerRow}>
              {/* TELEFONE */}
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <FontAwesome name="phone" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    Telefone
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={filtros.telefone}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, telefone: text }))
                  }
                />
              </View>

              {/* DEPARTAMENTO */}
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <FontAwesome6 name="industry" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    Departamento
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={filtros.departamento}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, departamento: text }))
                  }
                />
              </View>

              {/* AOS CUIDADOS DE */}
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <MaterialIcons name="co-present" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    Aos cuidados de
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={filtros.aosCuidadosDe}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, aosCuidadosDe: text }))
                  }
                />
              </View>

              {/* STATUS */}
              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <MaterialCommunityIcons
                    name="list-status"
                    size={24}
                    color="black"
                  />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    Status
                  </Text>
                </View>
                <Text
                  selectable={false}
                  style={[
                    globalStyles.input,
                    { backgroundColor: colors.lightGray },
                  ]}
                >
                  {filtros.status}
                </Text>
              </View>
            </View>

            {/* Penultima linha Container */}
            <View
              style={[
                globalStyles.filtroContainerRow,
                {
                  justifyContent: "space-between",
                  marginTop: -10,
                  flexWrap: "wrap",
                },
              ]}
            >
              {/* Lado esquerdo */}
              {/* STATUS */}
              <View style={globalStyles.filtroUltimaLinha}>
                {/* TODOS */}
                <Pressable
                  style={globalStyles.radioLabelContainer}
                  onPress={() =>
                    setFiltros((prev) => ({ ...prev, status: "TODOS" }))
                  }
                >
                  <View style={globalStyles.radioButton}>
                    {filtros.status === "TODOS" && (
                      <View style={globalStyles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      filtros.status === "TODOS"
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    TODOS
                  </Text>
                </Pressable>

                {/* PENDENTE */}
                <Pressable
                  style={globalStyles.radioLabelContainer}
                  onPress={() =>
                    setFiltros((prev) => ({ ...prev, status: "PENDENTE" }))
                  }
                >
                  <View style={globalStyles.radioButton}>
                    {filtros.status === "PENDENTE" && (
                      <View style={globalStyles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      filtros.status === "PENDENTE"
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    PENDENTE
                  </Text>
                </Pressable>

                {/* ACEITO */}
                <Pressable
                  style={globalStyles.radioLabelContainer}
                  onPress={() =>
                    setFiltros((prev) => ({ ...prev, status: "ACEITO" }))
                  }
                >
                  <View style={globalStyles.radioButton}>
                    {filtros.status === "ACEITO" && (
                      <View style={globalStyles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      filtros.status === "ACEITO"
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    ACEITO
                  </Text>
                </Pressable>

                {/* RECUSADO */}
                <Pressable
                  style={globalStyles.radioLabelContainer}
                  onPress={() =>
                    setFiltros((prev) => ({ ...prev, status: "RECUSADO" }))
                  }
                >
                  <View style={globalStyles.radioButton}>
                    {filtros.status === "RECUSADO" && (
                      <View style={globalStyles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      filtros.status === "RECUSADO"
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    RECUSADO
                  </Text>
                </Pressable>

                {/* CANCELADO */}
                <Pressable
                  style={globalStyles.radioLabelContainer}
                  onPress={() =>
                    setFiltros((prev) => ({ ...prev, status: "CANCELADO" }))
                  }
                >
                  <View style={globalStyles.radioButton}>
                    {filtros.status === "CANCELADO" && (
                      <View style={globalStyles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      filtros.status === "CANCELADO"
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    CANCELADO
                  </Text>
                </Pressable>
              </View>

              {/* Lado Direito */}
              {/* MOTIVO DA RECUSA */}
              {filtros.status === "RECUSADO" && (
                <View style={globalStyles.filtroUltimaLinha}>
                  {/* TODOS */}
                  <Pressable
                    style={globalStyles.radioLabelContainer}
                    onPress={() =>
                      setFiltros((prev) => ({ ...prev, motivoRecusa: "TODOS" }))
                    }
                  >
                    <View style={globalStyles.radioButton}>
                      {filtros.motivoRecusa === "TODOS" && (
                        <View style={globalStyles.radioFill} />
                      )}
                    </View>
                    <Text
                      style={[
                        globalStyles.labelText,
                        filtros.motivoRecusa === "TODOS"
                          ? { fontWeight: 700 }
                          : { fontWeight: 400 },
                      ]}
                      selectable={false}
                    >
                      TODOS
                    </Text>
                  </Pressable>

                  {/* ORÇAMENTO NÃO PROSSEGUIU */}
                  <Pressable
                    style={globalStyles.radioLabelContainer}
                    onPress={() =>
                      setFiltros((prev) => ({
                        ...prev,
                        motivoRecusa: "ORÇAMENTO NÃO PROSSEGUIU",
                      }))
                    }
                  >
                    <View style={globalStyles.radioButton}>
                      {filtros.motivoRecusa === "ORÇAMENTO NÃO PROSSEGUIU" && (
                        <View style={globalStyles.radioFill} />
                      )}
                    </View>
                    <Text
                      style={[
                        globalStyles.labelText,
                        filtros.motivoRecusa === "ORÇAMENTO NÃO PROSSEGUIU"
                          ? { fontWeight: 700 }
                          : { fontWeight: 400 },
                      ]}
                      selectable={false}
                    >
                      ORÇAMENTO NÃO PROSSEGUIU
                    </Text>
                  </Pressable>

                  {/* FECHOU COM OUTRA GALVANIZADORA */}
                  <Pressable
                    style={globalStyles.radioLabelContainer}
                    onPress={() =>
                      setFiltros((prev) => ({
                        ...prev,
                        motivoRecusa: "FECHOU COM OUTRA GALVANIZADORA",
                      }))
                    }
                  >
                    <View style={globalStyles.radioButton}>
                      {filtros.motivoRecusa ===
                        "FECHOU COM OUTRA GALVANIZADORA" && (
                        <View style={globalStyles.radioFill} />
                      )}
                    </View>
                    <Text
                      style={[
                        globalStyles.labelText,
                        filtros.motivoRecusa ===
                        "FECHOU COM OUTRA GALVANIZADORA"
                          ? { fontWeight: 700 }
                          : { fontWeight: 400 },
                      ]}
                      selectable={false}
                    >
                      FECHOU COM OUTRA GALVANIZADORA
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Ultima linha Container */}
            <View
              style={[
                globalStyles.filtroContainerRow,
                { justifyContent: "space-between", marginTop: -10 },
              ]}
            >
              <View />

              {/* Lado direito */}
              <View style={globalStyles.filtroUltimaLinha}>
                {/* Exportar */}
                <MenuOptionButton
                  containerStyle={[
                    globalStyles.button,
                    {
                      backgroundColor: colors.purple,
                    },
                  ]}
                  labelStyle={globalStyles.buttonText}
                  label={
                    <View style={globalStyles.buttonLabel}>
                      <MaterialCommunityIcons
                        name="microsoft-excel"
                        size={35}
                        color="white"
                      />
                      <Text style={{ color: "white" }}>Exportar</Text>
                    </View>
                  }
                  onPress={() => {
                    setIsExportarModalVisible(true);
                  }}
                />

                {/* Limpar filtro */}
                <MenuOptionButton
                  containerStyle={[
                    globalStyles.button,
                    globalStyles.buttonFiltrosContainer,
                    {
                      borderWidth: temFiltroAtivo ? 3 : 2,
                      borderColor: temFiltroAtivo ? colors.red : colors.gray,
                    },
                  ]}
                  labelStyle={globalStyles.buttonText}
                  label={
                    <View style={globalStyles.buttonLabel}>
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
        </View>
      )}

      <ScrollView
        style={{ marginRight: -16 }}
        contentContainerStyle={{ gap: 16, paddingRight: 16, paddingBottom: 16 }}
      >
        {orcamentos.length === 0 ? (
          <View style={styles.card}>
            <Text style={[styles.value, { textAlign: "center" }]}>{aviso}</Text>
          </View>
        ) : (
          orcamentosFiltrados.map(renderOrcamento)
        )}
      </ScrollView>

      <StatusModal
        visible={isStatusModalVisible}
        onClose={() => {
          setMotivoRecusaObrigatorioMsg("");
          setIsStatusModalVisible(false);
        }}
      >
        <View style={{ gap: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 36, fontWeight: 700 }}>Alterar Status</Text>
          <View
            style={{
              gap: 20,
              marginLeft: statusSelecionado === "RECUSADO" ? 82 : 0,
            }}
          >
            {/* PENDENTE */}
            <Pressable
              style={globalStyles.radioLabelContainer}
              onPress={() => setStatusSelecionado("PENDENTE")}
            >
              <View style={globalStyles.radioButton}>
                {statusSelecionado === "PENDENTE" && (
                  <View style={globalStyles.radioFill} />
                )}
              </View>
              <Text
                style={[
                  globalStyles.labelText,
                  statusSelecionado === "PENDENTE"
                    ? { fontWeight: 700 }
                    : { fontWeight: 400 },
                ]}
                selectable={false}
              >
                Pendente
              </Text>
            </Pressable>

            {/* ACEITO */}
            <Pressable
              style={globalStyles.radioLabelContainer}
              onPress={() => setStatusSelecionado("ACEITO")}
            >
              <View style={globalStyles.radioButton}>
                {statusSelecionado === "ACEITO" && (
                  <View style={globalStyles.radioFill} />
                )}
              </View>
              <Text
                style={[
                  globalStyles.labelText,
                  statusSelecionado === "ACEITO"
                    ? { fontWeight: 700 }
                    : { fontWeight: 400 },
                ]}
                selectable={false}
              >
                Aceito
              </Text>
            </Pressable>

            {/* RECUSADO */}
            <Pressable
              style={globalStyles.radioLabelContainer}
              onPress={() => setStatusSelecionado("RECUSADO")}
            >
              <View style={globalStyles.radioButton}>
                {statusSelecionado === "RECUSADO" && (
                  <View style={globalStyles.radioFill} />
                )}
              </View>
              <Text
                style={[
                  globalStyles.labelText,
                  statusSelecionado === "RECUSADO"
                    ? { fontWeight: 700 }
                    : { fontWeight: 400 },
                ]}
                selectable={false}
              >
                Recusado
              </Text>
            </Pressable>

            {/* MOTIVO DA RECUSA */}
            {statusSelecionado === "RECUSADO" && (
              <View>
                <Text
                  style={[
                    globalStyles.labelText,
                    { fontSize: 16, marginTop: -12, marginBottom: 4 },
                  ]}
                >
                  Motivo da recusa:
                </Text>
                <Picker
                  placeholder={{
                    label: "Selecione uma opção...",
                    value: "",
                  }}
                  style={{
                    inputWeb: {
                      fontSize: 18,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 10,
                      color: "#333",
                      backgroundColor: "white",
                      marginLeft: statusSelecionado === "RECUSADO" ? -82 : 0,
                    },
                  }}
                  value={motivoRecusa}
                  onValueChange={(value) => setMotivoRecusa(value)}
                  items={[
                    {
                      label: "Orçamento não prosseguiu",
                      value: "Orçamento não prosseguiu",
                    },
                    {
                      label: "Fechou com outra galvanizadora",
                      value: "Fechou com outra galvanizadora",
                    },
                  ]}
                />
                <Text
                  style={[
                    globalStyles.errorText,
                    {
                      marginLeft: statusSelecionado === "RECUSADO" ? -40 : 0,
                    },
                  ]}
                  selectable={false}
                >
                  {motivoRecusaObrigatorioMsg}
                </Text>
              </View>
            )}

            {/* CANCELADO */}
            <Pressable
              style={[
                globalStyles.radioLabelContainer,
                statusSelecionado === "RECUSADO" && { marginTop: -12 },
              ]}
              onPress={() => setStatusSelecionado("CANCELADO")}
            >
              <View style={globalStyles.radioButton}>
                {statusSelecionado === "CANCELADO" && (
                  <View style={globalStyles.radioFill} />
                )}
              </View>
              <Text
                style={[
                  globalStyles.labelText,
                  statusSelecionado === "CANCELADO"
                    ? { fontWeight: 700 }
                    : { fontWeight: 400 },
                ]}
                selectable={false}
              >
                Cancelado
              </Text>
            </Pressable>
          </View>

          {/* Salvar */}
          <MenuOptionButton
            enabled={motivoRecusa !== ""}
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
            onPress={() => {
              if (motivoRecusa !== "") {
                setMotivoRecusaObrigatorioMsg("");
                atualizarStatusOrcamento();
              }
            }}
          />
        </View>
      </StatusModal>

      {/* ExportModal */}
      <ExportarModal
        visible={isExportarModalVisible}
        onClose={() => setIsExportarModalVisible(false)}
        title="Exportar dados"
        maxWidth={1000}
      >
        <View style={{ flexDirection: "row", gap: 30 }}>
          {/* PDF */}
          <Pressable
            style={globalStyles.radioLabelContainer}
            onPress={() => setTipoExport(1)}
          >
            <View style={globalStyles.radioButton}>
              {tipoExport === 1 && <View style={globalStyles.radioFill} />}
            </View>
            <Text
              style={[
                globalStyles.labelText,
                tipoExport === 1 ? { fontWeight: 700 } : { fontWeight: 400 },
              ]}
              selectable={false}
            >
              PDF
            </Text>
          </Pressable>

          {/* EXCEL */}
          <Pressable
            style={globalStyles.radioLabelContainer}
            onPress={() => setTipoExport(2)}
          >
            <View style={globalStyles.radioButton}>
              {tipoExport === 2 && <View style={globalStyles.radioFill} />}
            </View>
            <Text
              style={[
                globalStyles.labelText,
                tipoExport === 2 ? { fontWeight: 700 } : { fontWeight: 400 },
              ]}
              selectable={false}
            >
              EXCEL
            </Text>
          </Pressable>
        </View>

        <Text style={[globalStyles.labelText, { color: colors.red }]}>
          ATENÇÃO: Os dados exportados serão de acordo com o filtro selecionado
        </Text>

        <MenuOptionButton
          containerStyle={[
            globalStyles.button,
            {
              backgroundColor: colors.purple,
            },
          ]}
          labelStyle={globalStyles.buttonText}
          label={
            <View style={globalStyles.buttonLabel}>
              <Text style={{ color: "white" }}>Exportar</Text>
              <MaterialCommunityIcons
                name="file-export-outline"
                size={28}
                color="white"
              />
            </View>
          }
          onPress={async () => {
            try {
              if (tipoExport === 1) exportarPDFOrcamentos(orcamentosFiltrados);
              if (tipoExport === 2)
                exportarExcelOrcamentos(orcamentosFiltrados);
            } catch (erro: any) {
              alert(erro.message);
              console.log(erro.message);
            }
          }}
        />
      </ExportarModal>
    </View>
  );
}

function juntarDataHora(dataBase: Date, hora: string) {
  const [h, m] = hora.split(":").map(Number);

  const nova = new Date(dataBase);
  nova.setHours(h, m, 0, 0);

  return nova;
}

function parseDateLocal(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
