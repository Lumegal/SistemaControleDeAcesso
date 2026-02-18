import {
  AntDesign,
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
  TouchableOpacity,
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
  ICargaFiltros,
} from "../../interfaces/carga";
import {
  createNovaCarga,
  deleteCarga,
  exportarCargas,
  exportarExcel,
  exportarPDF,
  getCargas,
  updateCarga,
} from "../../services/cargas";
import { useLoading } from "../../context/providers/loading";
import EditModal from "../_components/SimpleModal";
import DeleteModal from "../_components/SimpleModal";
import ExportarModal from "../_components/SimpleModal";
import { useAuth } from "../../context/auth";
import { socket } from "../../services/httpclient";
import { IJwtPayload } from "../../interfaces/jwt";
import React from "react";
import { getEmpresa, createEmpresa } from "../../services/empresa";
import {
  getMotoristaPorRgCpf,
  createMotorista,
} from "../../services/motorista";
import { getPlaca, createPlaca } from "../../services/placa";

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
    entradaDataStr: entradaDate?.toLocaleDateString(),
    saidaDataStr: saidaDate?.toLocaleDateString(),

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
  ordemAsc: boolean,
  onToggleOrdem: () => void,
) => {
  return (
    <View
      style={[globalStyles.mainContainer, { height: 70, alignItems: "center" }]}
    >
      <View
        style={[
          {
            flex: widthIdColumn,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 5,
          },
        ]}
      >
        <Text
          style={[globalStyles.tableHeader, { flex: 0 }]}
          selectable={false}
        >
          ID
        </Text>

        <Pressable onPress={onToggleOrdem}>
          <Feather
            name={ordemAsc ? "arrow-up" : "arrow-down"}
            size={20}
            color="black"
          />
        </Pressable>
      </View>
      <Text style={globalStyles.tableHeader} selectable={false}>
        DATA
      </Text>
      <Text style={globalStyles.tableHeader} selectable={false}>
        HORÁRIOS
      </Text>
      <Text style={globalStyles.tableHeader} selectable={false}>
        EMPRESA
      </Text>
      <Text style={globalStyles.tableHeader} selectable={false}>
        PLACA
      </Text>
      <Text style={globalStyles.tableHeader} selectable={false}>
        MOTORISTA
      </Text>
      <Text style={globalStyles.tableHeader} selectable={false}>
        RG / CPF
      </Text>
      <Text style={globalStyles.tableHeader} selectable={false}>
        CELULAR
      </Text>
      <Text style={globalStyles.tableHeader} selectable={false}>
        Nº NF
      </Text>
      <Text style={globalStyles.tableHeader} selectable={false}>
        C/D
      </Text>
      {(usuario?.nivelDeAcesso === 1 || usuario?.nivelDeAcesso === 2) && (
        <Text style={globalStyles.tableHeader} selectable={false}>
          AÇÕES
        </Text>
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
    const dataEntradaDiferente =
      carga.entradaDataStr && carga.entradaDataStr !== carga.chegadaDataStr;

    const dataSaidaDiferente =
      carga.saidaDataStr && carga.saidaDataStr !== carga.chegadaDataStr;

    const algumaDataDiferente = dataEntradaDiferente || dataSaidaDiferente;

    return (
      <View style={globalStyles.tableRegister}>
        <View style={[globalStyles.tableColumn, { flex: widthIdColumn }]}>
          <Text style={globalStyles.tableColumnText}>{carga.id}</Text>
        </View>

        {/* Se todas as datas da carga forem as mesmas, exibe apenas uma data (a de chegada) */}
        {!algumaDataDiferente && (
          <View style={globalStyles.tableColumn}>
            <Text style={globalStyles.tableColumnText}>
              {carga.chegadaDataStr}
            </Text>
          </View>
        )}

        {/* Se alguma data for diferente, as datas de Chegada, Entrada e Saída serão mostradas */}
        {algumaDataDiferente && (
          <View style={globalStyles.tableColumn}>
            <View style={[globalStyles.tableDataRow]}>
              <Text
                style={[
                  globalStyles.tableColumnText,
                  globalStyles.tableDataRowText,
                ]}
              >
                {carga.chegadaDataStr}
              </Text>
            </View>

            <View style={[globalStyles.tableDataRow]}>
              <Text
                style={[
                  globalStyles.tableColumnText,
                  globalStyles.tableDataRowText,
                ]}
              >
                {carga.entradaDataStr}
              </Text>
            </View>

            <View style={[globalStyles.tableDataRow, { borderBottomWidth: 0 }]}>
              <Text
                style={[
                  globalStyles.tableColumnText,
                  globalStyles.tableDataRowText,
                ]}
              >
                {carga.saidaDataStr}
              </Text>
            </View>
          </View>
        )}

        <View
          style={[
            globalStyles.tableColumn,
            {
              alignItems: "stretch",
            },
          ]}
        >
          <View style={globalStyles.tableDataRow}>
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
          <Text style={globalStyles.tableColumnText}>{carga.empresa.nome}</Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>{carga.placa.placa}</Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>
            {carga.motorista.nome}
          </Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={globalStyles.tableColumnText}>
            {carga.motorista.rgCpf}
          </Text>
        </View>
        <View style={globalStyles.tableColumn}>
          <Text style={[globalStyles.tableColumnText, { fontSize: 18 }]}>
            {carga.motorista.celular}
          </Text>
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

        {/* Ações */}
        {(usuario?.nivelDeAcesso === 1 || usuario?.nivelDeAcesso === 2) && (
          <View
            style={[
              globalStyles.tableColumn,
              { flexDirection: "row", gap: 20 },
            ]}
          >
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
              label={
                <Feather
                  name="edit"
                  size={35}
                  color="white"
                  style={{ marginRight: -3 }}
                />
              }
              onPress={() => onEdit(carga)}
            />

            {/* Excluir */}
            <MenuOptionButton
              containerStyle={{
                backgroundColor: colors.red,
                height: 55,
                width: 55,
                alignItems: "center",
                justifyContent: "center",
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
  filtroUltimaLinha: {
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
  modalLabelInputContainer: {
    width: "100%",
    gap: 5,
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
  const [isExportarModalVisible, setIsExportarModalVisible] =
    useState<boolean>(false);
  const [tipoExport, setTipoExport] = useState<1 | 2>(1);

  const [horarios, setHorarios] = useState<IUpdateCargaForm>({
    chegada: "",
    entrada: "",
    saida: "",
  });
  const [modalNumeroNotaFiscal, setModalNumeroNotaFiscal] =
    useState<string>("");

  // Filtros
  // 0 = todos, 1 = carregamento, 2 = descarregamento
  const [filtros, setFiltros] = useState<ICargaFiltros>({
    dataInicial: "",
    horarioInicial: "00:00",
    dataFinal: "",
    horarioFinal: "23:59",
    id: "",
    empresa: "",
    rgCpf: "",
    numeroNotaFiscal: "",
    tipoOperacao: 0,
  });
  const [filtrosVisible, setFiltrosVisible] = useState<boolean>(true);

  const [cargasFiltradas, setCargasFiltradas] = useState<ICargaFormatada[]>([]);
  const temFiltroAtivo = useMemo(() => {
    return (
      filtros.dataInicial !== "" ||
      filtros.dataFinal !== "" ||
      filtros.id.trim() !== "" ||
      filtros.empresa.trim() !== "" ||
      filtros.rgCpf.trim() !== "" ||
      filtros.numeroNotaFiscal.trim() !== "" ||
      filtros.tipoOperacao !== 0
    );
  }, [
    filtros.dataInicial,
    filtros.dataFinal,
    filtros.id,
    filtros.empresa,
    filtros.rgCpf,
    filtros.numeroNotaFiscal,
    filtros.tipoOperacao,
  ]);
  const [ordemAsc, setOrdemAsc] = useState(false);

  // export modal
  const [camposSelecionados, setCamposSelecionados] = useState<string[]>([
    "id",
    "data",
    "horarios",
    "empresa",
    "placa",
    "motorista",
    "rgCpf",
    "celular",
    "numeroNotaFiscal",
    "tipoOperacao",
  ]);
  const CAMPOS_EXPORTACAO = [
    { key: "id", label: "ID" },
    { key: "data", label: "Data" },
    { key: "horarios", label: "Horários" },
    { key: "empresa", label: "Empresa" },
    { key: "placa", label: "Placa" },
    { key: "motorista", label: "Motorista" },
    { key: "rgCpf", label: "RG / CPF" },
    { key: "celular", label: "Celular" },
    { key: "numeroNotaFiscal", label: "Nº NF" },
    { key: "tipoOperacao", label: "Carregamento / Descarregamento" },
  ];
  const metade = Math.ceil(CAMPOS_EXPORTACAO.length / 2);
  const colunaEsquerda = CAMPOS_EXPORTACAO.slice(0, metade);
  const colunaDireita = CAMPOS_EXPORTACAO.slice(metade);

  const toggleOrdem = () => {
    setOrdemAsc((prev) => !prev);
  };

  const filtrar = () => {
    let resultado = [...cargas];

    resultado = resultado.filter((c) => {
      // PERÍODO
      const inicio =
        filtros.dataInicial && filtros.horarioInicial
          ? juntarDataHora(
              parseDateLocal(filtros.dataInicial),
              filtros.horarioInicial,
            )
          : null;

      const fim =
        filtros.dataFinal && filtros.horarioFinal
          ? juntarDataHora(
              parseDateLocal(filtros.dataFinal),
              filtros.horarioFinal,
            )
          : null;

      if (inicio && c.chegada < inicio) return false;
      if (fim && c.chegada > fim) return false;

      // ID
      if (filtros.id && !c.id.toString().includes(filtros.id.trim()))
        return false;

      // EMPRESA
      if (
        filtros.empresa &&
        !c.empresa.nome
          .toLowerCase()
          .includes(filtros.empresa.trim().toLowerCase())
      )
        return false;

      // NOME / RG / CPF - MOTORISTA
      if (filtros.rgCpf) {
        const busca = filtros.rgCpf.trim().toLowerCase();

        const bateRgCpf = c.motorista.rgCpf?.toLowerCase().includes(busca);
        const bateNome = c.motorista.nome?.toLowerCase().includes(busca);

        if (!bateRgCpf && !bateNome) return false;
      }

      // NOTA FISCAL
      if (
        filtros.numeroNotaFiscal &&
        !(c.numeroNotaFiscal ?? "")
          .toLowerCase()
          .includes(filtros.numeroNotaFiscal.trim().toLowerCase())
      )
        return false;

      // TIPO OPERAÇÃO
      if (filtros.tipoOperacao !== 0 && c.tipoOperacao !== filtros.tipoOperacao)
        return false;

      return true;
    });

    // AQUI entra a ordenação
    resultado.sort((a, b) => (ordemAsc ? a.id - b.id : b.id - a.id));

    setCargasFiltradas(resultado);
  };

  const limparFiltro = () => {
    setFiltros((prev) => ({ ...prev, dataInicial: "" }));
    setFiltros((prev) => ({ ...prev, horarioInicial: "00:00" }));
    setFiltros((prev) => ({ ...prev, dataFinal: "" }));
    setFiltros((prev) => ({ ...prev, horarioFinal: "23:59" }));
    setFiltros((prev) => ({ ...prev, id: "" }));
    setFiltros((prev) => ({ ...prev, empresa: "" }));
    setFiltros((prev) => ({ ...prev, rgCpf: "" }));
    setFiltros((prev) => ({ ...prev, numeroNotaFiscal: "" }));
    setFiltros((prev) => ({ ...prev, tipoOperacao: 0 }));

    setOrdemAsc(false);
  };

  const getData = useCallback(async () => {
    try {
      showLoading();
      const resultado: ICarga[] = await getCargas();

      const formatadas = resultado.map(formatarCarga);

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
    filtros.dataInicial,
    filtros.dataFinal,
    filtros.horarioInicial,
    filtros.horarioFinal,
    filtros.id,
    filtros.empresa,
    filtros.rgCpf,
    filtros.numeroNotaFiscal,
    filtros.tipoOperacao,
    cargas,
    ordemAsc,
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
    () => renderTableHeader(usuario, globalStyles, ordemAsc, toggleOrdem),
    [usuario, globalStyles, ordemAsc],
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

    setModalNumeroNotaFiscal(carga.numeroNotaFiscal);

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

      const hoje = new Date();

      await updateCarga(
        {
          chegada: juntarDataHora(cargaSelecionada.chegada, horarios.chegada),
          entrada: horarios.entrada
            ? juntarDataHora(hoje, horarios.entrada)
            : null,
          saida: horarios.saida ? juntarDataHora(hoje, horarios.saida) : null,
          numeroNotaFiscal: modalNumeroNotaFiscal,
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

      // ===== EMPRESA =====
      let empresa = await getEmpresa(
        cargaSelecionada.empresa.nome.toUpperCase(),
      );

      if (!empresa) {
        empresa = await createEmpresa({
          nome: cargaSelecionada.empresa.nome.toUpperCase(),
          ativo: true,
        });
      }

      // ===== MOTORISTA =====
      let motorista = await getMotoristaPorRgCpf(
        cargaSelecionada.motorista.rgCpf.toUpperCase(),
      );

      if (!motorista) {
        motorista = await createMotorista({
          nome: cargaSelecionada.motorista.nome.toUpperCase(),
          rgCpf: cargaSelecionada.motorista.rgCpf.toUpperCase(),
          celular: cargaSelecionada.motorista.celular,
        });
      }

      // ===== PLACA =====
      let placa = await getPlaca(cargaSelecionada.placa.placa.toUpperCase());

      if (!placa) {
        placa = await createPlaca({
          placa: cargaSelecionada.placa.placa.toUpperCase(),
        });
      }

      const carga: INovaCarga = {
        chegada: juntarDataHora(cargaSelecionada.chegada, horarios.saida),
        entrada: juntarDataHora(cargaSelecionada.chegada, horarios.saida),
        empresaId: cargaSelecionada.empresa.id,
        placaId: cargaSelecionada.placa.id,
        motoristaId: cargaSelecionada.motorista.id,
        tipoOperacao: 1,
      };

      await createNovaCarga(carga);

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

  const toggleCampo = (key: string) => {
    setCamposSelecionados((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const selecionarTodos = () => {
    setCamposSelecionados(CAMPOS_EXPORTACAO.map((c) => c.key));
  };

  const desmarcarTodos = () => {
    setCamposSelecionados([]);
  };

  const montarDadosExportacao = () => {
    return cargasFiltradas.map((c) => {
      const obj: Record<string, any> = {};

      if (camposSelecionados.includes("id")) {
        obj["ID"] = c.id;
      }

      if (camposSelecionados.includes("data")) {
        obj["Data"] = c.chegadaDataStr;
      }

      if (camposSelecionados.includes("horarios")) {
        obj["Chegada"] = c.chegadaHoraStr;
        obj["Entrada"] = c.entradaHoraStr;
        obj["Saída"] = c.saidaHoraStr;
      }

      if (camposSelecionados.includes("empresa")) {
        obj["Empresa"] = c.empresa.nome;
      }

      if (camposSelecionados.includes("placa")) {
        obj["Placa"] = c.placa.placa;
      }

      if (camposSelecionados.includes("motorista")) {
        obj["Motorista"] = c.motorista.nome;
      }

      if (camposSelecionados.includes("rgCpf")) {
        obj["RG / CPF"] = c.motorista.rgCpf;
      }

      if (camposSelecionados.includes("celular")) {
        obj["Celular"] = c.motorista.celular;
      }

      if (camposSelecionados.includes("numeroNotaFiscal")) {
        obj["Nº NF"] = c.numeroNotaFiscal ?? "S/NF";
      }

      if (camposSelecionados.includes("tipoOperacao")) {
        obj["Operação"] =
          c.tipoOperacao === 1 ? "Carregamento" : "Descarregamento";
      }

      return obj;
    });
  };

  return (
    <View
      style={[
        globalStyles.mainContainer,
        { flexDirection: "column", flex: 1, padding: 24 },
      ]}
    >
      {/* FILTRO CONTAINER */}
      {!filtrosVisible && (
        <Pressable
          style={{
            flexDirection: "row",
            gap: 10,
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.4)",
            backgroundColor: "white",
            paddingHorizontal: 12,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
          onPress={() => setFiltrosVisible(true)}
        >
          <Text style={{ fontWeight: 500, fontSize: 22 }}>Filtros</Text>
          <AntDesign name="arrow-down" size={20} color="black" />
        </Pressable>
      )}

      {filtrosVisible && (
        <View style={globalStyles.mainContainer}>
          <Pressable
            style={{
              height: 20,
              width: "auto",
              position: "absolute",
              zIndex: 999,
              right: 28,
              top: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
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
                    value={filtros.dataInicial}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        dataInicial: e.target.value,
                      }))
                    }
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
                    value={filtros.horarioInicial}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        horarioInicial: e.target.value,
                      }))
                    }
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
                    value={filtros.dataFinal}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        dataFinal: e.target.value,
                      }))
                    }
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
                    value={filtros.horarioFinal}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        horarioFinal: e.target.value,
                      }))
                    }
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
                  value={filtros.id}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, id: text }))
                  }
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
                  value={filtros.empresa}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, empresa: text }))
                  }
                />
              </View>

              <View style={globalStyles.dataLabelInputContainer}>
                <View style={globalStyles.dataLabelContainer}>
                  <FontAwesome name="id-card-o" size={24} color="black" />
                  <Text style={globalStyles.dataLabelText} selectable={false}>
                    NOME / RG / CPF - Motorista
                  </Text>
                </View>
                <TextInput
                  style={globalStyles.input}
                  value={filtros.rgCpf}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, rgCpf: text }))
                  }
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
                  value={filtros.numeroNotaFiscal}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, numeroNotaFiscal: text }))
                  }
                />
              </View>
            </View>

            {/* Ultima linha Container */}
            <View
              style={[
                globalStyles.filtroContainerRow,
                { justifyContent: "space-between", marginTop: -10 },
              ]}
            >
              {/* Lado esquerdo */}
              <View style={styles.filtroUltimaLinha}>
                {/* TODOS */}
                <Pressable
                  style={styles.radioLabelContainer}
                  onPress={() =>
                    setFiltros((prev) => ({ ...prev, tipoOperacao: 0 }))
                  }
                >
                  <View style={styles.radioButton}>
                    {filtros.tipoOperacao === 0 && (
                      <View style={styles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      filtros.tipoOperacao === 0
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
                  onPress={() =>
                    setFiltros((prev) => ({ ...prev, tipoOperacao: 1 }))
                  }
                >
                  <View style={styles.radioButton}>
                    {filtros.tipoOperacao === 1 && (
                      <View style={styles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      filtros.tipoOperacao === 1
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
                  onPress={() =>
                    setFiltros((prev) => ({ ...prev, tipoOperacao: 2 }))
                  }
                >
                  <View style={styles.radioButton}>
                    {filtros.tipoOperacao === 2 && (
                      <View style={styles.radioFill} />
                    )}
                  </View>
                  <Text
                    style={[
                      globalStyles.labelText,
                      filtros.tipoOperacao === 2
                        ? { fontWeight: 700 }
                        : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    Descarregamento
                  </Text>
                </Pressable>
              </View>

              {/* Lado direito */}
              <View style={styles.filtroUltimaLinha}>
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
                    <View style={styles.buttonLabel}>
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
        </View>
      )}
      <FlatList
        data={cargasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={5}
        ListHeaderComponent={tableHeader}
        stickyHeaderIndices={[0]}
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

      {/* <EditModal /> */}
      {isEditModalVisible && (
        <EditModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          title="Editar carga"
        >
          <View
            style={{
              gap: 30,
              width: "100%",
              maxWidth: 500,
              alignItems: "center",
            }}
          >
            <View style={styles.modalLabelInputContainer}>
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
            </View>

            <View style={styles.modalLabelInputContainer}>
              <Text style={globalStyles.labelText}>Entrada</Text>
              <input
                type="time"
                style={{
                  ...dataInputStyle,
                  ...(!horarios.chegada && {
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }),
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
            </View>

            <View style={styles.modalLabelInputContainer}>
              <Text style={globalStyles.labelText}>Saída</Text>
              <input
                type="time"
                style={{
                  ...dataInputStyle,
                  ...(!horarios.entrada && {
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }),
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
            </View>

            <View style={styles.modalLabelInputContainer}>
              <Text style={globalStyles.labelText}>Nota fiscal</Text>
              <TextInput
                style={globalStyles.input}
                value={modalNumeroNotaFiscal}
                onChangeText={(text) => setModalNumeroNotaFiscal(text)}
              />
            </View>

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
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
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
          </View>
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
                {cargaSelecionada?.empresa.nome}
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

      <ExportarModal
        visible={isExportarModalVisible}
        onClose={() => setIsExportarModalVisible(false)}
        title="Exportar dados"
        maxWidth={1000}
      >
        <View style={{ flexDirection: "row", gap: 30 }}>
          {/* PDF */}
          <Pressable
            style={styles.radioLabelContainer}
            onPress={() => setTipoExport(1)}
          >
            <View style={styles.radioButton}>
              {tipoExport === 1 && <View style={styles.radioFill} />}
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
            style={styles.radioLabelContainer}
            onPress={() => setTipoExport(2)}
          >
            <View style={styles.radioButton}>
              {tipoExport === 2 && <View style={styles.radioFill} />}
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
        <Text style={[globalStyles.labelText, { fontSize: 32 }]}>
          Campos a serem exportados:
        </Text>

        {/* Ações rápidas */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 15,
            gap: 30,
          }}
        >
          <TouchableOpacity onPress={selecionarTodos}>
            <Text
              style={[
                globalStyles.labelText,
                {
                  backgroundColor: colors.lightBlue,
                  fontWeight: "600",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 1)",
                  color: "white",
                },
              ]}
            >
              Selecionar todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={desmarcarTodos}>
            <Text
              style={[
                globalStyles.labelText,
                {
                  backgroundColor: colors.red,
                  fontWeight: "600",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 1)",
                  color: "white",
                },
              ]}
            >
              Desmarcar todos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de checkboxes em 2 colunas */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {/* COLUNA ESQUERDA */}
          <View style={{ flex: 1, gap: 14 }}>
            {colunaEsquerda.map((campo) => {
              const selecionado = camposSelecionados.includes(campo.key);

              return (
                <Pressable
                  key={campo.key}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                  onPress={() => toggleCampo(campo.key)}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderWidth: 2,
                      borderColor: selecionado ? colors.lightBlue : "#CFCFCF",
                      borderRadius: 6,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: selecionado
                        ? colors.lightBlue
                        : "transparent",
                    }}
                  >
                    {selecionado && (
                      <Feather name="check" size={15} color="white" />
                    )}
                  </View>

                  <Text
                    style={[
                      globalStyles.labelText,
                      selecionado ? { fontWeight: "700" } : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    {campo.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ESPAÇO ENTRE COLUNAS */}
          <View style={{ width: 40 }} />

          {/* COLUNA DIREITA */}
          <View style={{ flex: 1, gap: 14 }}>
            {colunaDireita.map((campo) => {
              const selecionado = camposSelecionados.includes(campo.key);

              return (
                <Pressable
                  key={campo.key}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                  onPress={() => toggleCampo(campo.key)}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderWidth: 2,
                      borderColor: selecionado ? colors.lightBlue : "#CFCFCF",
                      borderRadius: 6,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: selecionado
                        ? colors.lightBlue
                        : "transparent",
                    }}
                  >
                    {selecionado && (
                      <Feather name="check" size={15} color="white" />
                    )}
                  </View>

                  <Text
                    style={[
                      globalStyles.labelText,
                      selecionado ? { fontWeight: "700" } : { fontWeight: 400 },
                    ]}
                    selectable={false}
                  >
                    {campo.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <MenuOptionButton
          containerStyle={[
            globalStyles.button,
            {
              backgroundColor: colors.purple,
            },
          ]}
          labelStyle={globalStyles.buttonText}
          label={
            <View style={styles.buttonLabel}>
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
              const dados = montarDadosExportacao();
              // console.log("Filtros: ", filtros);
              // console.log("Campos selecionados: ", camposSelecionados);
              // console.log("Dados: ", dados);

              const campos = normalizarCampos(camposSelecionados);
              // console.log("Campos: ", campos);

              // console.log("Tipo export: ", tipoExport);

              const resultado = await exportarCargas(
                filtros,
                camposSelecionados.includes("data") ||
                  camposSelecionados.includes("horarios")
                  ? campos
                  : camposSelecionados,
              );

              if (tipoExport === 1) exportarPDF(resultado);
              if (tipoExport === 2) exportarExcel(resultado);

              console.log(resultado);
            } catch (erro: any) {
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

function normalizarCampos(campos: string[]): string[] {
  const novosCampos = [...campos];

  const temData = novosCampos.includes("data");
  const temHorarios = novosCampos.includes("horarios");

  if (temData || temHorarios) {
    // Remove data e horarios
    const filtrados = novosCampos.filter(
      (c) => c !== "data" && c !== "horarios",
    );

    // Adiciona os campos reais
    return [...filtrados, "chegada", "entrada", "saida"];
  }

  return novosCampos;
}
