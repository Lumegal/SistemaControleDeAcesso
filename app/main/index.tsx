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
import { Feather, MaterialIcons } from "@expo/vector-icons";
import FormTitle from "../_components/FormTitle";

export default function Main() {
  const globalStyles = getGlobalStyles();
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
            params.subPage === "novaCarga" && (
              <FormTitle
                icon={
                  <MaterialIcons
                    name="add-circle-outline"
                    size={40}
                    color={"white"}
                  />
                }
                title="Nova Carga"
              />
            )}

          {params.pageName === "operacoes" && params.subPage === "cargas" && (
            <FormTitle
              icon={<Feather name="package" size={40} color={"white"} />}
              title="Cargas"
            />
          )}

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
