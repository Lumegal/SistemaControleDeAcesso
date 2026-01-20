import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import { getGlobalStyles } from "../globalStyles";
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { getAllEmpresa } from "../services/empresa";
import { IEmpresa } from "../interfaces/empresa";
import { colors } from "../colors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLoading } from "../context/providers/loading";

export default function Login() {
  const { login, logout } = useAuth();
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const [email, setEmail] = useState(" ");
  const [senha, setSenha] = useState(" ");
  const [isSenhaVisible, setIsSenhaVisible] = useState<boolean>(false);

  const [empresas, setEmpresas] = useState<IEmpresa[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setEmpresas(await getAllEmpresa());
        await logout();
      } catch (erro: any) {
        alert(erro.message);
      }
    };

    getData();
  }, []);

  const handleLogin = async () => {
    try {
      showLoading();
      await login({ email, senha });

      router.push({
        pathname: "/main",
        params: {
          pageName: "operacoes",
          subPage: "novaCarga",
        },
      });
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <View style={globalStyles.background}>
      <View style={styles.mainContent}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 20,
            color: "black",
          }}
        >
          PORTARIA LUMEGAL
        </Text>
        <View style={styles.loginInputContainer}>
          <Feather
            name="mail"
            size={20}
            color={colors.blue}
            style={styles.iconSpace}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={handleLogin}
          />
          <View style={styles.iconSpace}></View>
        </View>

        <View style={styles.loginInputContainer}>
          <Feather name="lock" size={20} color={colors.blue} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#ccc"
            secureTextEntry={!isSenhaVisible}
            onChangeText={(text) => setSenha(text)}
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            onPress={() => setIsSenhaVisible(!isSenhaVisible)}
            style={[styles.iconSpace, { alignItems: "flex-end" }]}
          >
            <Feather
              name={isSenhaVisible ? "eye-off" : "eye"}
              size={20}
              color={colors.blue}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { maxWidth: 300 }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f3fa",
  },
  mainContent: {
    flex: 1,
    width: "95%",
    maxWidth: 1000,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  iconSpace: {
    width: 20,
  },
  input: {
    flex: 1,
    height: 50,
    color: "black",
    fontSize: 16,
    fontWeight: 600,
    outlineStyle: "none" as any,
  },
  // Botoes
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 20,
    backgroundColor: colors.blue,
    boxShadow: "0px 5px 5px #000c27ff",
  },
  buttonCancelar: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 20,
    backgroundColor: "#B30F03",
    boxShadow: "0px 5px 5px #290300ff",
  },
  buttonText: {
    color: "white",
    fontWeight: 600,
    fontSize: 18,
    paddingHorizontal: 30,
  },
  buttonRowContainer: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  label: {
    width: "60%",
    padding: 10,
    fontSize: 30,
  },
  inputText: {
    height: "5%",
    width: "60%",
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 20,
    marginBottom: 20,
  },
  showPasswordButton: {
    borderRadius: 20,
    width: 50,
    alignItems: "center",
  },
  loginInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 20,
    paddingHorizontal: 15,
    gap: 15,
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 10,
    justifyContent: "space-between",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.8)",
  },
});
