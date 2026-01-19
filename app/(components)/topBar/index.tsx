import { View, Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function TopBar() {
  return (
    <View
      style={{
        width: "100%",
        height: "10%",
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 48,
        gap: 20,
      }}
    >
      <FontAwesome6 name="user-circle" size={42} color="black" />
      <Text style={{ fontSize: 24, fontWeight: 500 }}>Thiago Raia</Text>
    </View>
  );
}
