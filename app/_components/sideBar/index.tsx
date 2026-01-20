import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { colors } from "../../../colors";
import {
  Feather,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import { router } from "expo-router";

export default function SideBar() {
  const menuIconSize: number = 28;
  const textMainColor: string = "white";

  const styles = StyleSheet.create({
    sideBar: {
      flex: 2,
      height: "100%",
      backgroundColor: colors.blue,
    },
    logo: {
      width: "100%",
      height: "10%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
    },
    logoImage: {
      width: "90%",
      height: "90%",
    },
    scrollViewContent: {
      flexGrow: 1,
      padding: 12,
    },
    menuSection: {
      padding: 12,
      gap: 6,
    },
    menuSectionLabel: {
      color: textMainColor,
      fontSize: 18,
      fontWeight: 600,
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
    menuOptionLabel: {
      color: textMainColor,
      fontSize: 18,
      fontWeight: 600,
    },
    menuIcon: {
      color: textMainColor,
    },
    logoutButton: {
      width: "90%",
      alignSelf: "center",
      marginTop: "auto",
      backgroundColor: "#db2114",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 12,
      padding: 24,
      borderRadius: 12,
      gap: 12,
      ...Platform.select({
        web: {
          transitionDuration: "150ms",
        },
      }),
    },
    version: {
      color: textMainColor,
      textAlign: "center",
      opacity: 0.7,
      marginTop: "auto",
    },
  });

  return (
    <View style={styles.sideBar}>
      <View style={styles.logo}>
        <Image
          source={require("../../../assets/Logo-Lumegal-Site.jpg")}
          resizeMode="contain"
          style={styles.logoImage}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Principal */}
        {/* <View style={styles.menuSection}>
          <Text style={styles.menuSectionLabel} selectable={false}>
            Principal
          </Text>
          <Pressable
            style={(state: any) => [
              styles.menuOption,
              Platform.OS === "web" &&
                state.hovered && {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              state.pressed && { backgroundColor: "rgba(255,255,255,0.5)" },
            ]}
            onPress={() => console.log("Dashboard")}
          >
            <AntDesign
              name="dashboard"
              size={menuIconSize}
              color={textMainColor}
            />
            <Text style={styles.menuOptionLabel} selectable={false}>
              Dashboard
            </Text>
          </Pressable>
        </View> */}

        {/* Operações */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionLabel} selectable={false}>
            Operações
          </Text>

          {/* Nova carga */}
          <Pressable
            style={(state: any) => [
              styles.menuOption,
              Platform.OS === "web" &&
                state.hovered && {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              state.pressed && { backgroundColor: "rgba(255,255,255,0.5)" },
            ]}
            onPress={() => {
              console.log("Nova carga");
              router.push({
                pathname: "/main",
                params: {
                  pageName: "operacoes",
                  subPage: "novaCarga",
                },
              });
            }}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={menuIconSize}
              style={styles.menuIcon}
            />
            <Text style={styles.menuOptionLabel} selectable={false}>
              Nova carga
            </Text>
          </Pressable>

          {/* Cargas */}
          <Pressable
            style={(state: any) => [
              styles.menuOption,
              Platform.OS === "web" &&
                state.hovered && {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              state.pressed && { backgroundColor: "rgba(255,255,255,0.5)" },
            ]}
            onPress={() =>
              router.push({
                pathname: "/main",
                params: {
                  pageName: "operacoes",
                  subPage: "cargas"
                },
              })
            }
          >
            <Feather
              name="package"
              size={menuIconSize}
              style={styles.menuIcon}
            />
            <Text style={styles.menuOptionLabel} selectable={false}>
              Cargas
            </Text>
          </Pressable>
        </View>

        {/* Cadastros */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionLabel} selectable={false}>
            Cadastros
          </Text>

          {/* Motoristas */}
          <Pressable
            style={(state: any) => [
              styles.menuOption,
              Platform.OS === "web" &&
                state.hovered && {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              state.pressed && { backgroundColor: "rgba(255,255,255,0.5)" },
            ]}
             onPress={() => {
              console.log("Motoristas");
              router.push({
                pathname: "/main",
                params: {
                  pageName: "cadastros",
                  subPage: "motoristas",
                },
              });
            }}
          >
            <FontAwesome
              name="drivers-license-o"
              size={menuIconSize}
              style={styles.menuIcon}
            />
            <Text style={styles.menuOptionLabel} selectable={false}>
              Motoristas
            </Text>
          </Pressable>

          {/* Clientes */}
          <Pressable
            style={(state: any) => [
              styles.menuOption,
              Platform.OS === "web" &&
                state.hovered && {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              state.pressed && { backgroundColor: "rgba(255,255,255,0.5)" },
            ]}
            onPress={() => {
              console.log("Clientes");
              router.push({
                pathname: "/main",
                params: {
                  pageName: "cadastros",
                  subPage: "clientes",
                },
              });
            }}
          >
            <MaterialCommunityIcons
              name="office-building-outline"
              size={menuIconSize}
              style={styles.menuIcon}
            />
            <Text style={styles.menuOptionLabel} selectable={false}>
              Clientes
            </Text>
          </Pressable>

          {/* Veículos */}
          <Pressable
            style={(state: any) => [
              styles.menuOption,
              Platform.OS === "web" &&
                state.hovered && {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              state.pressed && { backgroundColor: "rgba(255,255,255,0.5)" },
            ]}
            onPress={() => {
              console.log("Motoristas");
              router.push({
                pathname: "/main",
                params: {
                  pageName: "cadastros",
                  subPage: "veiculos",
                },
              });
            }}
          >
            <MaterialCommunityIcons
              name="truck-outline"
              size={menuIconSize}
              style={styles.menuIcon}
            />
            <Text style={styles.menuOptionLabel} selectable={false}>
              Veículos
            </Text>
          </Pressable>
        </View>

        {/* Relatórios */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionLabel} selectable={false}>
            Relatórios
          </Text>

          {/* PDF */}
          <Pressable
            style={(state: any) => [
              styles.menuOption,
              Platform.OS === "web" &&
                state.hovered && {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              state.pressed && { backgroundColor: "rgba(255,255,255,0.5)" },
            ]}
            onPress={() => console.log("PDF")}
          >
            <FontAwesome6
              name="file-pdf"
              size={menuIconSize}
              style={styles.menuIcon}
            />
            <Text style={styles.menuOptionLabel} selectable={false}>
              PDF
            </Text>
          </Pressable>

          {/* Excel */}
          <Pressable
            style={(state: any) => [
              styles.menuOption,
              Platform.OS === "web" &&
                state.hovered && {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              state.pressed && { backgroundColor: "rgba(255,255,255,0.5)" },
            ]}
            onPress={() => console.log("Excel")}
          >
            <MaterialCommunityIcons
              name="microsoft-excel"
              size={menuIconSize}
              style={styles.menuIcon}
            />
            <Text style={styles.menuOptionLabel} selectable={false}>
              Excel
            </Text>
          </Pressable>
        </View>

        {/* <Pressable
          style={(state: any) => [
            styles.logoutButton,
            Platform.OS === "web" &&
              state.hovered && {
                backgroundColor: "rgba(255, 0, 0, 0.8)",
              },
            state.pressed && { backgroundColor: "rgba(209, 25, 25, 0.8)" },
          ]}
          onPress={async () => {
            try {
              setCarregando(true);
              await logout();
              router.push("/");
            } catch (erro: any) {
              alert(erro.message);
            } finally {
              setCarregando(false);
            }
          }}
        >
          <Feather name="log-out" size={menuIconSize} style={styles.menuIcon} />
          <Text style={styles.menuOptionLabel} selectable={false}>
            Logout
          </Text>
        </Pressable> */}
        <Text style={styles.version} selectable={false}>
          V0.5.0
        </Text>
      </ScrollView>
    </View>
  );
}
