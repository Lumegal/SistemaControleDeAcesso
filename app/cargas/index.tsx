import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { FormTitle } from "../_components/FormTitle";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MenuOptionButton } from "../_components/MenuOptionButton";
import { getGlobalStyles } from "../../globalStyles";
import { colors } from "../../colors";

export default function Cargas() {
  const globalStyles = getGlobalStyles();

  // Array só para demonstração, repetindo o mesmo registro 10 vezes
  const registrosDemo = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    data: "01/01/2026",
    horarios: {
      chegada: "08:00",
      entrada: "09:00",
      saida: "10:00",
    },
    empresa: "Trópico",
    placa: "ABC-1234",
    motorista: "João Batista",
    nf: "123456789",
    tipo: "Carregamento",
  }));

  const dataInputStyle = {
    border: "1px solid #949494",
    borderRadius: 10,
    minHeight: 28,
    padding: "10px",
    fontSize: 20,
  };

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
      <FormTitle
        icon={<Feather name="package" size={40} color={"white"} />}
        title="Cargas"
      />
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
              <Text style={globalStyles.tableHeader}>AÇÕES</Text>
            </View>

            {registrosDemo.map((registro) => (
              <View key={registro.id} style={globalStyles.tableRegister}>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>{registro.data}</Text>
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
                      style={[globalStyles.tableColumnText, globalStyles.tableDataRowText]}
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
                      {registro.horarios.chegada}
                    </Text>
                  </View>
                  <View style={[globalStyles.tableDataRow]}>
                    <Text
                      style={[globalStyles.tableColumnText, globalStyles.tableDataRowText]}
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
                      {registro.horarios.entrada}
                    </Text>
                  </View>
                  <View style={[globalStyles.tableDataRow, { borderBottomWidth: 0 }]}>
                    <Text
                      style={[globalStyles.tableColumnText, globalStyles.tableDataRowText]}
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
                      {registro.horarios.saida}
                    </Text>
                  </View>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>{registro.empresa}</Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>{registro.placa}</Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {registro.motorista}
                  </Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>{registro.nf}</Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>{registro.tipo}</Text>
                </View>
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
                    labelStyle={{}}
                    label={<Feather name="edit" size={35} color="white" />}
                    onPress={() => {}}
                  />
                  <MenuOptionButton
                    containerStyle={{
                      backgroundColor: "#FF4C4C",
                      paddingHorizontal: 13,
                      paddingVertical: 8,
                      borderRadius: 10,
                    }}
                    labelStyle={{}}
                    label={
                      <FontAwesome name="trash-o" size={37} color="white" />
                    }
                    onPress={() => {}}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
}
