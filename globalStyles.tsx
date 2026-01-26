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
      paddingHorizontal: 12,
      gap: 40,
    },
    formRow: {
      flexDirection: "row",
      padding: 24,
      gap: 40,
      justifyContent: "space-evenly",
    },
    labelInputContainer: {
      flex: 1,
      gap: 5,
    },
    labelText: {
      fontWeight: 500,
      fontSize: 24,
    },
    inputText: {
      borderWidth: 1,
      borderColor: "#aaa",
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
  });
};
