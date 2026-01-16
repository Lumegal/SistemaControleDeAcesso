import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { colors } from "../../colors";
import {
  Feather,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

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
      height: "15%",
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
          source={require("../../assets/Logo-Lumegal-Site.jpg")}
          resizeMode="contain"
          style={styles.logoImage}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Principal */}
        <View style={styles.menuSection}>
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
        </View>

        {/* Operações */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionLabel} selectable={false}>
            Operações
          </Text>

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
            onPress={() => console.log("Cargas")}
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
            onPress={() => console.log("Nova carga")}
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
            onPress={() => console.log("Motoristas")}
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
            onPress={() => console.log("Clientes")}
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
            onPress={() => console.log("Veículos")}
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
        <Text style={styles.version} selectable={false}>
          V0.2.0
        </Text>
      </ScrollView>
    </View>
  );
}
