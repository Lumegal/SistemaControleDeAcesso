import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { Entypo, Feather, FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";
import { router } from "expo-router";
import { useLoading } from "../../context/providers/loading";

export default function TopBar() {
  const { showLoading, hideLoading } = useLoading();
  const { usuario, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
      <Text style={styles.userName}>
        {(usuario && usuario.nome.trim().split(/\s+/)[0]) || "Carregando..."}
      </Text>

      <Pressable
        style={styles.userButton}
        onPress={() => setMenuOpen((prev) => !prev)}
      >
        <FontAwesome6 name="user-circle" size={42} color="black" />
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Entypo name="chevron-down" size={24} color="black" />
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
        <Pressable style={styles.option}>
          <Text style={styles.optionText} selectable={false}>
            Meu perfil
          </Text>
          <FontAwesome6 name="user" size={24} color="black" />
        </Pressable>

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
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 48,
    gap: 20,
    zIndex: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "500",
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
