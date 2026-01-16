import { StyleSheet } from "react-native";

export const getGlobalStyles = () => {
  return StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eee",
    },
  });
};
