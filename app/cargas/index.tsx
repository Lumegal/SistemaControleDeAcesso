import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MenuOptionButton from "../_components/MenuOptionButton";
import { dataInputStyle, getGlobalStyles } from "../../globalStyles";
import { colors } from "../../colors";
import { useEffect, useState } from "react";
import { ICarga, IUpdateCargaForm } from "../../interfaces/carga";
import { getCargas, updateCarga } from "../../services/cargas";
import { useLoading } from "../../context/providers/loading";
import EditModal from "../_components/EditModal";
import { useAuth } from "../../context/auth";

export default function Cargas() {
  const { usuario } = useAuth();
  const globalStyles = getGlobalStyles();
  const [cargas, setCargas] = useState<ICarga[]>([]);
  const [cargaSelecionada, setCargaSelecionada] = useState<ICarga>();
  const { showLoading, hideLoading } = useLoading();
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  const [horarios, setHorarios] = useState<IUpdateCargaForm>({
    chegada: "",
    entrada: "",
    saida: "",
  });

  const getData = async () => {
    try {
      showLoading();
      const resultado: ICarga[] = await getCargas();

      const ordemDescrescente = resultado.reverse();

      setCargas(ordemDescrescente);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const styles = StyleSheet.create({
    // dataInput: {
    //   borderWidth: 1,
    //   borderColor: "#949494",
    //   borderRadius: 5,
    //   paddingHorizontal: 10,
    //   paddingVertical: 5,
    // },
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
      borderColor: "#949494",
      alignSelf: "flex-end",
    },
    buttonLabel: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <>
      <View style={{ margin: 24, gap: 20, flex: 1 }}>
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
                  color="#949494"
                />
                <Text style={{ color: "#949494" }}>Limpar</Text>
              </View>
            }
            onPress={() => {}}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            style={[
              globalStyles.mainContainer,
              {
                flexDirection: "column",
                padding: 0,
                flexGrow: 0,
              },
            ]}
            stickyHeaderIndices={[0]}
          >
            <View
              style={[
                globalStyles.mainContainer,
                { height: 70, alignItems: "center" },
              ]}
            >
              <Text style={globalStyles.tableHeader}>DATA</Text>
              <Text style={globalStyles.tableHeader}>HORÁRIOS</Text>
              <Text style={globalStyles.tableHeader}>EMPRESA</Text>
              <Text style={globalStyles.tableHeader}>PLACA</Text>
              <Text style={globalStyles.tableHeader}>MOTORISTA</Text>
              <Text style={globalStyles.tableHeader}>Nº NF</Text>
              <Text style={globalStyles.tableHeader}>C/D</Text>
              {(usuario?.nivelDeAcesso === 1 ||
                usuario?.nivelDeAcesso === 2) && (
                <Text style={globalStyles.tableHeader}>AÇÕES</Text>
              )}
            </View>

            {cargas.map((carga) => (
              <View key={carga.id} style={globalStyles.tableRegister}>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {carga.chegada.toLocaleDateString()}
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
                      {carga.chegada.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <View style={[globalStyles.tableDataRow]}>
                    <Text
                      style={[
                        globalStyles.tableColumnText,
                        globalStyles.tableDataRowText,
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
                      {carga.entrada
                        ? carga.entrada.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                    </Text>
                  </View>
                  <View
                    style={[
                      globalStyles.tableDataRow,
                      { borderBottomWidth: 0 },
                    ]}
                  >
                    <Text
                      style={[
                        globalStyles.tableColumnText,
                        globalStyles.tableDataRowText,
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
                      {carga.saida
                        ? carga.saida.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                    </Text>
                  </View>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {carga.empresa}
                  </Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {carga.placa}
                  </Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {carga.motorista}
                  </Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {carga.numeroNotaFiscal ? carga.numeroNotaFiscal : "S/NF"}
                  </Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {carga.tipoOperacao === 1
                      ? "Carregamento"
                      : "Descarregamento"}
                  </Text>
                </View>

                {(usuario?.nivelDeAcesso === 1 ||
                  usuario?.nivelDeAcesso === 2) && (
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
                      onPress={() => {
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
                      }}
                    />
                    <MenuOptionButton
                      containerStyle={{
                        backgroundColor: colors.red,
                        paddingHorizontal: 13,
                        paddingVertical: 8,
                        borderRadius: 10,
                      }}
                      label={
                        <FontAwesome name="trash-o" size={37} color="white" />
                      }
                      onPress={() => {}}
                    />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* <EditModal /> */}
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
                    ? juntarDataHora(cargaSelecionada.chegada, horarios.entrada)
                    : null,
                  saida: horarios.saida
                    ? juntarDataHora(cargaSelecionada.chegada, horarios.saida)
                    : null,
                },
                cargaSelecionada.id,
              );

              await getData();
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
