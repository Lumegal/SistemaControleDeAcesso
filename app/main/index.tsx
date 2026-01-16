import { View, StyleSheet } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import SideBar from "../sideBar";

export default function Main() {
  const globalStyles = getGlobalStyles();
  const styles = StyleSheet.create({});

  return (
    <View style={globalStyles.background}>
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
        }}
      >
        <SideBar />
        <View style={{ flex: 8 }}></View>
      </View>
    </View>
  );
}
