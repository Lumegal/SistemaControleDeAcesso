import { Platform, StyleSheet } from "react-native";
import { colors } from "./colors";

export const getGlobalStyles = () => {
  return StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eee",
    },
    menuOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderRadius: 12,
      gap: 12,
      ...Platform.select({
        web: {
          transitionDuration: "150ms",
        },
      }),
    },
    formContainer: {
      justifyContent: "flex-start",
      margin: 24,
      padding: 24,
      gap: 40,
      borderRadius: 10,
      backgroundColor: "white",
      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.4)",
    },
    formRow: {
      flexDirection: "row",
      gap: 40,
      justifyContent: "space-evenly",
    },
    labelInputContainer: {
      flex: 1,
      gap: 5,
      justifyContent: "space-evenly",
      backgroundColor: "white",
      margin: 12,
      borderRadius: 10,
    },
    labelText: {
      fontWeight: 500,
      fontSize: 24,
    },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: colors.gray,
      minHeight: 28,
      padding: 10,
      fontSize: 20,
    },
    button: {
      width: 200,
      maxHeight: 50,
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: 600,
      fontSize: 20,
    },
    errorText: {
      color: "red",
      fontSize: 18,
      marginTop: 4,
    },
    dataHorarioContainer: {
      flex: 1,
      flexDirection: "row",
      gap: 20,
    },
    maximizarFiltroButton: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      backgroundColor: "#ffffff",
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 5,
    },
    minimizarFiltroButton: {
      height: 20,
      width: "auto",
      position: "absolute",
      zIndex: 999,
      right: 28,
      top: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    filtroUltimaLinha: {
      flexDirection: "row",
      alignItems: "center",
      gap: 40,
    },
    buttonLabel: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonFiltrosContainer: {
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
      width: 24,
      height: 24,
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
      fontSize: 24,
    },

    // Tabela
    mainContainer: {
      borderRadius: 10,
      padding: 24,
      flexDirection: "row",
      gap: 20,

      backgroundColor: "#ffffff",

      borderWidth: 1,
      borderColor: "#e2e8f0",

      boxShadow: "0px 4px 14px rgba(0,0,0,0.06)",
    },
    filtroContainer: {
      flex: 1,
      flexDirection: "column",
      gap: 30,
    },
    filtroContainerRow: {
      borderRadius: 5,
      flexDirection: "row",
      gap: 20,
      backgroundColor: "white",
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
    tableHeader: {
      flex: 1,
      fontSize: 18,
      fontWeight: 600,
      textAlign: "center",
    },
    tableRegister: {
      paddingHorizontal: 7,
      flexDirection: "row",
      minHeight: 150,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    tableColumn: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 6,
    },
    tableColumnText: {
      fontSize: 20,
      fontWeight: 400,
      textAlign: "center",
      paddingHorizontal: 6,
    },
    tableDataRow: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    tableDataRowText: {
      flex: 1,
      color: "black",
      fontSize: 20,
    },
    modalContainer: {
      gap: 30,
      width: "100%",
      maxWidth: 500,
      alignItems: "center",
    },
    modalLabelInputContainer: {
      width: "100%",
      gap: 5,
    },
  });
};

export const dataInputStyle = {
  flex: 1,
  border: "1px solid #949494",
  borderRadius: 10,
  minHeight: 28,
  padding: "10px",
  fontSize: 20,
};
