import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import { FormTitle } from "../_components/FormTitle";
import { getGlobalStyles } from "../../globalStyles";
import { MenuOptionButton } from "../_components/MenuOptionButton";

export default function NovaCarga() {
  const globalStyles = getGlobalStyles();
  const now = new Date();
  const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [chegada, setChegada] = useState(nowLocal);
  const [tipoOperacao, setTipoOperacao] = useState<
    "carregamento" | "descarregamento" | null
  >(null);

  console.log(chegada);

  const checkboxSize: number = 24;

  const styles = StyleSheet.create({
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
      <View style={globalStyles.formContainer}>
        <View style={globalStyles.formRow}>
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>CHEGADA*</Text>
            <input
              value={chegada}
              type="datetime-local"
              style={globalStyles.inputText}
              onChange={(data) => {
                setChegada(data.target.value);
              }}
            />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>EMPRESA*</Text>
            <TextInput style={globalStyles.inputText} />
          </View>

          {/* <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>MARCA</Text>
            <TextInput style={styles.inputText} />
          </View> */}

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>PLACA*</Text>
            <TextInput style={globalStyles.inputText} />
          </View>
        </View>

        <View style={globalStyles.formRow}>
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>MOTORISTA*</Text>
            <TextInput style={globalStyles.inputText} />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>Nº DA NOTA FISCAL</Text>
            <TextInput style={globalStyles.inputText} />
          </View>

          {/* <View style={styles.labelInputContainer}>
            <Text style={styles.labelText}>Destino</Text>
            <TextInput style={styles.inputText} />
          </View> */}
        </View>

        <View style={globalStyles.formRow}>
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>
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

        <View
          style={[
            globalStyles.formRow,
            { justifyContent: "flex-end", gap: 50 },
          ]}
        >
          <MenuOptionButton
            containerStyle={[
              globalStyles.button,
              { backgroundColor: "#4cad4c" },
            ]}
            labelStyle={globalStyles.buttonText}
            label={
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={globalStyles.buttonText} selectable={false}>
                  Salvar
                </Text>
                <Feather name="check-circle" size={24} color="white" />
              </View>
            }
            onPress={() => {}}
          />

          {/* <Pressable style={[styles.button, { backgroundColor: "#DB2114" }]}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable> */}
        </View>
      </View>
    </>
  );
}
