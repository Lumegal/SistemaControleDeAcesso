import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import { getGlobalStyles } from "../globalStyles";
import { useState } from "react";
import { useAuth } from "../context/auth";

export default function Login() {
  const { usuario, handleLogin, setUsuario } = useAuth();
  const globalStyles = getGlobalStyles();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={globalStyles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.inputText}
        onChangeText={(text) => setUsuario({ ...usuario, email: text })}
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        secureTextEntry={true}
        style={styles.inputText}
        onChangeText={(text) => setUsuario({ ...usuario, senha: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        Entrar
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  button: {
    width: "10%",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
    color: "white",
    fontSize: 20,
    backgroundColor: "red",
  },
});
