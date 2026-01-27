import { Platform, StyleSheet } from "react-native";

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
      flex: 1,
      margin: 24,
      gap: 40,
    },
    formRow: {
      flexDirection: "row",
      gap: 40,
      justifyContent: "space-evenly",
    },
    labelInputContainer: {
      flex: 1,
      gap: 5,
      backgroundColor: "white",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
      padding: 12,
      borderRadius: 10,
    },
    labelText: {
      fontWeight: 500,
      fontSize: 24,
    },
    inputText: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "#7c7c7c",
      borderRadius: 5,
      padding: 10,
      fontSize: 24,
    },
    button: {
      minWidth: 150,
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

    // Tabela
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
};
