import { Feather, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import FormTitle from "../_components/FormTitle";
import { getGlobalStyles } from "../../globalStyles";
import MenuOptionButton from "../_components/MenuOptionButton";

export default function NovaCarga() {
  const globalStyles = getGlobalStyles();

  // Array só para demonstração, repetindo o mesmo registro 10 vezes
  const registrosDemo = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    nome: "Nome Motorista Placeholder",
    rgOuCpf: "999.999.999-99",
    celular: "(19) 99999-9999",
  }));

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
          <FontAwesome name="drivers-license-o" size={40} color={"white"} />
        }
        title="Motoristas"
      />
      <View style={[globalStyles.formContainer, { gap: 20 }]}>
        <View style={globalStyles.formRow}>
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>NOME*</Text>
            <TextInput style={globalStyles.input} />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>RG/CPF*</Text>
            <TextInput style={globalStyles.input} />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.labelText}>CELULAR</Text>
            <TextInput style={globalStyles.input} />
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
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            style={[
              globalStyles.mainContainer,
              {
                flexDirection: "column",
                padding: 0,
                flexGrow: 0,
              },
            ]}
            stickyHeaderIndices={[0]}
          >
            <View
              style={[
                globalStyles.mainContainer,
                { height: 70, alignItems: "center" },
              ]}
            >
              <Text style={globalStyles.tableHeader}>NOME</Text>
              <Text style={globalStyles.tableHeader}>RG/CPF</Text>
              <Text style={globalStyles.tableHeader}>CELULAR</Text>
              <Text style={globalStyles.tableHeader}>AÇÕES</Text>
            </View>

            {registrosDemo.map((registro) => (
              <View key={registro.id} style={globalStyles.tableRegister}>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {registro.nome}
                  </Text>
                </View>

                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {registro.rgOuCpf}
                  </Text>
                </View>
                <View style={globalStyles.tableColumn}>
                  <Text style={globalStyles.tableColumnText}>
                    {registro.celular}
                  </Text>
                </View>

                <View
                  style={[
                    globalStyles.tableColumn,
                    { flexDirection: "row", gap: 20 },
                  ]}
                >
                  <MenuOptionButton
                    containerStyle={{
                      backgroundColor: "#4CA64C",
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      borderRadius: 10,
                    }}
                    label={<Feather name="edit" size={35} color="white" />}
                    onPress={() => {}}
                  />
                  <MenuOptionButton
                    containerStyle={{
                      backgroundColor: "#FF4C4C",
                      paddingHorizontal: 13,
                      paddingVertical: 8,
                      borderRadius: 10,
                    }}
                    label={
                      <FontAwesome name="trash-o" size={37} color="white" />
                    }
                    onPress={() => {}}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
}
