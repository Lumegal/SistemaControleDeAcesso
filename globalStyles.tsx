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

    // Tabela
    mainContainer: {
      borderRadius: 5,
      padding: 24,
      flexDirection: "row",
      gap: 20,
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
      backgroundColor: "white",
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
