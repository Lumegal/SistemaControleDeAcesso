import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import { FormTitle } from "../_components/FormTitle";

export default function NovaCarga() {
  const [tipoOperacao, setTipoOperacao] = useState<
    "carregamento" | "descarregamento" | null
  >(null);

  const checkboxSize: number = 24;

  const styles = StyleSheet.create({
    formContainer: {
      justifyContent: "flex-start",
      flex: 1,
      paddingHorizontal: 12,
      gap: 40,
    },
    formRow: {
      flexDirection: "row",
      padding: 24,
      gap: 40,
      justifyContent: "space-evenly",
    },
    labelInputContainer: {
      flex: 1,
      gap: 5,
    },
    labelText: {
      fontWeight: 500,
      fontSize: 24,
    },
    inputText: {
      borderWidth: 1,
      borderColor: "#aaa",
      borderRadius: 5,
      padding: 10,
      fontSize: 24,
    },
    button: {
      minWidth: 150,
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: 600,
      fontSize: 20,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      marginTop: 5,
    },
    checkboxOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    checkboxBox: {
      width: checkboxSize,
      height: checkboxSize,
      borderWidth: 2,
      borderColor: "#555",
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: "#5789f3",
      borderColor: "#5789f3",
    },
    checkboxLabel: {
      fontSize: checkboxSize,
    },
  });

  return (
    <>
      <FormTitle
        icon={
          <MaterialIcons name="add-circle-outline" size={40} color={"white"} />
        }
        title="Nova Carga"
      />
      <View style={styles.formContainer}>
        <View style={styles.formRow}>
          {/* <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>DATA</Text>
            <TextInput style={styles.inputText} />
          </View> */}

          <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>EMPRESA*</Text>
            <TextInput style={styles.inputText} />
          </View>

          {/* <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>MARCA</Text>
            <TextInput style={styles.inputText} />
          </View> */}

          <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>PLACA*</Text>
            <TextInput style={styles.inputText} />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>MOTORISTA*</Text>
            <TextInput style={styles.inputText} />
          </View>

          <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>AJUDANTE</Text>
            <TextInput style={styles.inputText} />
          </View>

          {/* <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>Destino</Text>
            <TextInput style={styles.inputText} />
          </View> */}
        </View>

        <View style={styles.formRow}>
          <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>Nº DA NOTA FISCAL*</Text>
            <TextInput style={styles.inputText} />
          </View>

          <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>
              CARREGAMENTO / DESCARREGAMENTO*
            </Text>

            <View style={styles.checkboxRow}>
              {/* Carregamento */}
              <Pressable
                style={styles.checkboxOption}
                onPress={() => setTipoOperacao("carregamento")}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    tipoOperacao === "carregamento" && styles.checkboxChecked,
                  ]}
                >
                  {tipoOperacao === "carregamento" && (
                    <Feather name="check" size={checkboxSize} color="white" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Carregamento</Text>
              </Pressable>

              {/* Descarregamento */}
              <Pressable
                style={styles.checkboxOption}
                onPress={() => setTipoOperacao("descarregamento")}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    tipoOperacao === "descarregamento" &&
                      styles.checkboxChecked,
                  ]}
                >
                  {tipoOperacao === "descarregamento" && (
                    <Feather name="check" size={checkboxSize} color="white" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Descarregamento</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.formRow, { justifyContent: "flex-end", gap: 50 }]}>
          <Pressable style={[styles.button, { backgroundColor: "#4cad4c" }]}>
            <Text style={styles.buttonText} selectable={false}>
              Salvar
            </Text>
            <Feather name="check-circle" size={24} color="white" />
          </Pressable>

          {/* <Pressable style={[styles.button, { backgroundColor: "#DB2114" }]}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable> */}
        </View>
      </View>
    </>
  );
}
