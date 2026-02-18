import { Feather, FontAwesome } from "@expo/vector-icons";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import MenuOptionButton from "../_components/MenuOptionButton";
import { colors } from "../../colors";
import { useEffect, useState } from "react";
import { getAllMotoristas } from "../../services/motorista";
import { IMotorista } from "../../interfaces/motorista";
import React from "react";
import { IJwtPayload } from "../../interfaces/jwt";

export default function NovaCarga() {
  const globalStyles = getGlobalStyles();
  const [motoristas, setMotoristas] = useState<IMotorista[]>([]);

  const tableHeader = () => {
    return (
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
    );
  };

  const CargaRow = React.memo(
    ({
      motorista,
      globalStyles,
    }: {
      motorista: IMotorista;
      usuario?: IJwtPayload | null;
      globalStyles: ReturnType<typeof getGlobalStyles>;
      onEdit?: (m: IMotorista) => void;
      onDelete?: (m: IMotorista) => void;
    }) => {
      return (
        <View key={motorista.id} style={globalStyles.tableRegister}>
          <View style={globalStyles.tableColumn}>
            <Text style={globalStyles.tableColumnText}>{motorista.nome}</Text>
          </View>

          <View style={globalStyles.tableColumn}>
            <Text style={globalStyles.tableColumnText}>{motorista.rgCpf}</Text>
          </View>
          <View style={globalStyles.tableColumn}>
            <Text style={globalStyles.tableColumnText}>
              {motorista.celular}
            </Text>
          </View>

          <View style={globalStyles.tableColumn}>
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
            {/* <MenuOptionButton
                    containerStyle={{
                      backgroundColor: colors.red,
                      paddingHorizontal: 13,
                      paddingVertical: 8,
                      borderRadius: 10,
                    }}
                    label={<FontAwesome name="trash-o" size={37} color="white" />}
                    onPress={() => {}}
                  /> */}
          </View>
        </View>
      );
    },
  );

  useEffect(() => {
    const getData = async () => {
      const resultado = await getAllMotoristas();
      setMotoristas(resultado);
    };

    getData();
  }, []);

  return (
    <View style={[globalStyles.formContainer, { gap: 20, flex: 1 }]}>
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
        style={[globalStyles.formRow, { justifyContent: "flex-end", gap: 50 }]}
      >
        <MenuOptionButton
          containerStyle={[
            globalStyles.button,
            { backgroundColor: colors.green },
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
        <FlatList
          data={motoristas}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={5}
          ListHeaderComponent={tableHeader}
          stickyHeaderIndices={[0]}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews
          renderItem={({ item }) => (
            <CargaRow motorista={item} globalStyles={globalStyles} />
          )}
        ></FlatList>
      </View>
    </View>
  );
}
