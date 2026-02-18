import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAuth } from "../../context/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useLoading } from "../../context/providers/loading";
import { colors } from "../../colors";

type TopBarProps = {
  openSideBar: () => void;
};

export default function TopBar({ openSideBar }: TopBarProps) {
  const { showLoading, hideLoading } = useLoading();
  const { usuario, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useLocalSearchParams();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const animationDuration = 200;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: menuOpen ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: menuOpen ? 0 : -10,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: menuOpen ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [menuOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <Pressable style={[styles.titleContainer]} onPress={openSideBar}>
        <Entypo name="menu" size={40} color="white" />
        {params.pageName === "operacoes" && params.subPage === "novaCarga" && (
          <>
            <MaterialIcons
              name="add-circle-outline"
              size={40}
              color={"white"}
            />
            <Text style={[styles.title]} selectable={false}>
              {"Nova Carga"}
            </Text>
          </>
        )}

        {params.pageName === "operacoes" && params.subPage === "cargas" && (
          <>
            <Feather name="package" size={40} color={"white"} />
            <Text style={[styles.title]} selectable={false}>
              {"Cargas"}
            </Text>
          </>
        )}

        {params.pageName === "cadastros" && params.subPage === "motoristas" && (
          <>
            <FontAwesome name="drivers-license-o" size={40} color={"white"} />
            <Text style={[styles.title]} selectable={false}>
              {"Motoristas"}
            </Text>
          </>
        )}

        {params.pageName === "cadastros" && params.subPage === "clientes" && (
          <>
            <MaterialCommunityIcons
              name="office-building-outline"
              size={40}
              color={"white"}
            />
            <Text style={[styles.title]} selectable={false}>
              {"Clientes"}
            </Text>
          </>
        )}

        {params.pageName === "cadastros" && params.subPage === "veiculos" && (
          <>
            <MaterialCommunityIcons
              name="truck-outline"
              size={40}
              color={"white"}
            />
            <Text style={[styles.title]} selectable={false}>
              {"Veículos"}
            </Text>
          </>
        )}

        {params.pageName === "relatorios" && params.subPage === "pdf" && (
          <>
            {/* <FontAwesome name="drivers-license-o" size={40} color={"white"} /> */}
            <Text style={[styles.title]} selectable={false}>
              {"PDF"}
            </Text>
          </>
        )}

        {params.pageName === "relatorios" && params.subPage === "excel" && (
          <>
            {/* <FontAwesome name="drivers-license-o" size={40} color={"white"} /> */}
            <Text style={[styles.title]} selectable={false}>
              {"Excel"}
            </Text>
          </>
        )}
      </Pressable>

      <Pressable
        style={styles.userButton}
        onPress={() => setMenuOpen((prev) => !prev)}
      >
        <Text style={styles.userName} selectable={false}>
          {(usuario && usuario.nome.trim().split(/\s+/)[0]) || "Carregando..."}
        </Text>
        <FontAwesome6 name="user-circle" size={42} color="white" />
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Entypo name="chevron-down" size={24} color="white" />
        </Animated.View>
      </Pressable>

      {/* Dropdown flutuante */}
      <Animated.View
        pointerEvents={menuOpen ? "auto" : "none"}
        style={[
          styles.dropdown,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* <Pressable style={styles.option}>
          <Text style={styles.optionText} selectable={false}>
            Meu perfil
          </Text>
          <FontAwesome6 name="user" size={24} color="black" />
        </Pressable> */}

        <Pressable
          style={(state: any) => [
            styles.option,
            { backgroundColor: "#db2114" },
            Platform.OS === "web" &&
              state.hovered && { backgroundColor: "#b0091d" },
            state.pressed && { backgroundColor: "rgb(155, 21, 21)" },
          ]}
          onPress={async () => {
            try {
              showLoading();
              await logout();
              router.push("/");
            } catch (erro: any) {
              alert(erro.message);
            } finally {
              hideLoading();
            }
          }}
        >
          <Text
            style={[styles.optionText, { color: "white" }]}
            selectable={false}
          >
            Logout
          </Text>
          <Feather name="log-out" size={24} color={"white"} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "10%",
    backgroundColor: colors.lightBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    gap: 20,
    zIndex: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    color: "white",
    fontWeight: "500",
    fontSize: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    top: 70,
    right: 48,
    backgroundColor: "white",
    borderRadius: 8,
    minWidth: 200,
    zIndex: 999,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  option: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    ...Platform.select({
      web: {
        transitionDuration: "150ms",
      },
    }),
  },
  optionText: {
    fontSize: 18,
    fontWeight: 600,
  },
});
