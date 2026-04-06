import { View } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import { useLocalSearchParams } from "expo-router";
import SideBar from "../_components/SideBar";
import TopBar from "../_components/TopBar";
import { useState } from "react";
import Cargas from "../cargas"
import Motoristas from "../motoristas";
import NovaCarga from "../novaCarga";
import Clientes from "../clientes";
import Veiculos from "../veiculos";
import Itens from "../almoxarifado/itens";
import RegistrarItem from "../almoxarifado/registrarItem";
import EntradaSaida from "../almoxarifado/entradaSaida";
import Relatorios from "../almoxarifado/relatorios";
import NovoOrcamento from "../comercial/novoOrcamento.tsx";
import Orcamentos from "../comercial/orcamentos";

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

          {params.pageName === "comercial" && params.subPage === "novoOrcamento" && (
            <NovoOrcamento />
          )}

          {params.pageName === "comercial" && params.subPage === "orcamentos" && (
            <Orcamentos />
          )}

          {params.pageName === "almoxarifado" && params.subPage === "itens" && (
            <Itens />
          )}

          {params.pageName === "almoxarifado" && params.subPage === "registrarItem" && (
            <RegistrarItem />
          )}

          {params.pageName === "almoxarifado" && params.subPage === "entradaSaida" && (
            <EntradaSaida />
          )}

          {params.pageName === "almoxarifado" && params.subPage === "relatorios" && (
            <Relatorios />
          )}
        </View>
      </View>
    </View>
  );
}
