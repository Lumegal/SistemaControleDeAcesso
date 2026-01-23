import { View, StyleSheet } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import NovaCarga from "../novaCarga";
import { useLocalSearchParams } from "expo-router";
import SideBar from "../_components/SideBar";
import TopBar from "../_components/TopBar";
import Cargas from "../cargas";

export default function Main() {
  const globalStyles = getGlobalStyles();
  const styles = StyleSheet.create({});
  const params = useLocalSearchParams();

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
        <View style={{ flex: 8 }}>
          <TopBar />
          {params.pageName === "operacoes" &&
            params.subPage === "novaCarga" && <NovaCarga />}

          {params.pageName === "operacoes" && params.subPage === "cargas" && (
            <Cargas />
          )}

          {params.pageName === "cadastros" && params.subPage === "motoristas"}

          {params.pageName === "cadastros" && params.subPage === "clientes"}

          {params.pageName === "cadastros" && params.subPage === "veiculos"}
        </View>
      </View>
    </View>
  );
}
