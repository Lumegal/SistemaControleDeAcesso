import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import MenuOptionButton from "../_components/MenuOptionButton";
import { dataInputStyle, getGlobalStyles } from "../../globalStyles";
import { colors } from "../../colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ICarga,
  IUpdateCargaForm,
  ICargaFormatada,
} from "../../interfaces/carga";
import { deleteCarga, getCargas, updateCarga } from "../../services/cargas";
import { useLoading } from "../../context/providers/loading";
import EditModal from "../_components/SimpleModal";
import DeleteModal from "../_components/SimpleModal";
import { useAuth } from "../../context/auth";
import { socket } from "../../services/httpclient";
import { IJwtPayload } from "../../interfaces/jwt";
import React from "react";

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
      <Text style={globalStyles.tableHeader}>DATA</Text>
      <Text style={globalStyles.tableHeader}>HORÁRIOS</Text>
      <Text style={globalStyles.tableHeader}>EMPRESA</Text>
      <Text style={globalStyles.tableHeader}>PLACA</Text>
      <Text style={globalStyles.tableHeader}>MOTORISTA</Text>
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
          <Text style={globalStyles.tableColumnText}>
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
  button: {
    minWidth: 130,
    paddingHorizontal: 6,
    maxHeight: 50,
  },
  buttonFiltrar: {
    backgroundColor: colors.lightBlue,
    alignSelf: "flex-end",
  },
  buttonLimpar: {
    borderWidth: 2,
    borderColor: colors.gray,
    alignSelf: "flex-end",
  },
  buttonLabel: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
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

  const getData = useCallback(async () => {
    try {
      showLoading();
      const resultado: ICarga[] = await getCargas();

      const ordemDescrescente = [...resultado].sort(
        (a, b) => new Date(b.chegada).getTime() - new Date(a.chegada).getTime(),
      );

      const formatadas = ordemDescrescente.map(formatarCarga);

      setCargas(formatadas);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

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

  return (
    <>
      <View style={{ margin: 24, gap: 20, flex: 1 }}>
        {/* FILTRO CONTAINER */}
        <View style={globalStyles.mainContainer}>
          <View style={globalStyles.dataLabelInputContainer}>
            <View style={globalStyles.dataLabelContainer}>
              <FontAwesome name="calendar-o" size={24} color="black" />
              <Text style={globalStyles.dataLabelText} selectable={false}>
                Data Inicial
              </Text>
            </View>
            <input type="datetime-local" style={dataInputStyle} />
          </View>

          <View style={globalStyles.dataLabelInputContainer}>
            <View style={globalStyles.dataLabelContainer}>
              <FontAwesome name="calendar-o" size={24} color="black" />
              <Text style={globalStyles.dataLabelText} selectable={false}>
                Data Final
              </Text>
            </View>
            <input type="datetime-local" style={dataInputStyle} />
          </View>

          {/* Filtro */}
          <MenuOptionButton
            containerStyle={[
              globalStyles.button,
              styles.button,
              styles.buttonFiltrar,
            ]}
            labelStyle={globalStyles.buttonText}
            label={
              <View style={styles.buttonLabel}>
                <Feather name="filter" size={24} color="white" />
                <Text>Filtrar</Text>
              </View>
            }
            onPress={() => {}}
          />

          {/* Limpar filtro */}
          <MenuOptionButton
            containerStyle={[
              globalStyles.button,
              styles.button,
              styles.buttonLimpar,
            ]}
            labelStyle={globalStyles.buttonText}
            label={
              <View style={styles.buttonLabel}>
                <MaterialCommunityIcons
                  name="cancel"
                  size={24}
                  color={colors.gray}
                />
                <Text style={{ color: colors.gray }}>Limpar</Text>
              </View>
            }
            onPress={() => {}}
          />
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={cargas}
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
            style={dataInputStyle}
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
            style={dataInputStyle}
            value={horarios.saida}
            onChange={(e) =>
              setHorarios((prev) => ({
                ...prev,
                saida: e.target.value,
              }))
            }
          />

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
                if (!cargaSelecionada) return;

                const resultado = await updateCarga(
                  {
                    chegada: juntarDataHora(
                      cargaSelecionada.chegada,
                      horarios.chegada,
                    ),
                    entrada: horarios.entrada
                      ? juntarDataHora(
                          cargaSelecionada.chegada,
                          horarios.entrada,
                        )
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
            }}
          />
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
