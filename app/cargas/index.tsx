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
    mainContainer: {
      borderRadius: 5,
      padding: 15,
      flexDirection: "row",
      gap: 20,
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
      backgroundColor: "white",
    },
    dataLabelInputContainer: {
      flex: 1,
    },
    dataLabelContainer: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      marginBottom: 10,
    },
    dataLabelText: {
      fontSize: 18,
      fontWeight: 600,
    },
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
    tableHeader: {
      flex: 1,
      fontSize: 18,
      fontWeight: 600,
      textAlign: "center",
    },
    tableRegister: {
      flexDirection: "row",
      minHeight: 150,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    tableColumn: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    tableColumnText: {
      fontSize: 22,
      fontWeight: 400,
    },
    tableDataRow: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      padding: 8,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    tableDataRowText: {
      flex: 1,
      color: "black",
    },
  });
  return (
    <>
      <FormTitle
        icon={<Feather name="package" size={40} color={"white"} />}
        title="Cargas"
      />
      <View style={{ margin: 24, gap: 20, flex: 1 }}>
        <View style={styles.mainContainer}>
          <View style={styles.dataLabelInputContainer}>
            <View style={styles.dataLabelContainer}>
              <FontAwesome name="calendar-o" size={24} color="black" />
              <Text style={styles.dataLabelText} selectable={false}>
                Data Inicial
              </Text>
            </View>
            <input type="datetime-local" style={dataInputStyle} />
          </View>

          <View style={styles.dataLabelInputContainer}>
            <View style={styles.dataLabelContainer}>
              <FontAwesome name="calendar-o" size={24} color="black" />
              <Text style={styles.dataLabelText} selectable={false}>
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
              styles.mainContainer,
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
                styles.mainContainer,
                { height: 70, alignItems: "center" },
              ]}
            >
              <Text style={styles.tableHeader}>DATA</Text>
              <Text style={styles.tableHeader}>HORÁRIOS</Text>
              <Text style={styles.tableHeader}>EMPRESA</Text>
              <Text style={styles.tableHeader}>PLACA</Text>
              <Text style={styles.tableHeader}>MOTORISTA</Text>
              <Text style={styles.tableHeader}>Nº NF</Text>
              <Text style={styles.tableHeader}>C/D</Text>
              <Text style={styles.tableHeader}>AÇÕES</Text>
            </View>

            {registrosDemo.map((registro) => (
              <View key={registro.id} style={styles.tableRegister}>
                <View style={styles.tableColumn}>
                  <Text style={styles.tableColumnText}>{registro.data}</Text>
                </View>
                <View
                  style={[
                    styles.tableColumn,
                    {
                      alignItems: "stretch",
                    },
                  ]}
                >
                  <View style={[styles.tableDataRow]}>
                    <Text
                      style={[styles.tableColumnText, styles.tableDataRowText]}
                    >
                      Chegada:
                    </Text>
                    <Text
                      style={[
                        styles.tableColumnText,
                        styles.tableDataRowText,
                        { textAlign: "right" },
                      ]}
                    >
                      {registro.horarios.chegada}
                    </Text>
                  </View>
                  <View style={[styles.tableDataRow]}>
                    <Text
                      style={[styles.tableColumnText, styles.tableDataRowText]}
                    >
                      Entrada:
                    </Text>
                    <Text
                      style={[
                        styles.tableColumnText,
                        styles.tableDataRowText,
                        { textAlign: "right" },
                      ]}
                    >
                      {registro.horarios.entrada}
                    </Text>
                  </View>
                  <View style={[styles.tableDataRow]}>
                    <Text
                      style={[styles.tableColumnText, styles.tableDataRowText]}
                    >
                      Saída:
                    </Text>
                    <Text
                      style={[
                        styles.tableColumnText,
                        styles.tableDataRowText,
                        { textAlign: "right" },
                      ]}
                    >
                      {registro.horarios.saida}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.tableColumnText}>{registro.empresa}</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.tableColumnText}>{registro.placa}</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.tableColumnText}>
                    {registro.motorista}
                  </Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.tableColumnText}>{registro.nf}</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.tableColumnText}>{registro.tipo}</Text>
                </View>
                <View
                  style={[
                    styles.tableColumn,
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
