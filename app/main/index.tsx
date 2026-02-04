import { View } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import NovaCarga from "../novaCarga";
import { useLocalSearchParams } from "expo-router";
import SideBar from "../_components/SideBar";
import TopBar from "../_components/TopBar";
import Cargas from "../cargas";
import Motoristas from "../motoristas";
import Clientes from "../clientes";
import Veiculos from "../veiculos";
import { useState } from "react";

export default function Main() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();

  const [isSidebarVisible, setIsSideBarVisible] = useState<boolean>(false);

  const showHideSideBarModal = () => {
    setIsSideBarVisible(!isSidebarVisible);
  };

  return (
    <View style={globalStyles.background}>
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
        }}
      >
        <SideBar visible={isSidebarVisible} closeModal={showHideSideBarModal} />

        <View style={{ flex: 8 }}>
          <TopBar openSideBar={showHideSideBarModal} />

          {params.pageName === "operacoes" &&
            params.subPage === "novaCarga" && <NovaCarga />}

          {params.pageName === "operacoes" && params.subPage === "cargas" && (
            <Cargas />
          )}

          {params.pageName === "cadastros" &&
            params.subPage === "motoristas" && <Motoristas />}

          {params.pageName === "cadastros" && params.subPage === "clientes" && (
            <Clientes />
          )}

          {params.pageName === "cadastros" && params.subPage === "veiculos" && (
            <Veiculos />
          )}
        </View>
      </View>
    </View>
  );
}
