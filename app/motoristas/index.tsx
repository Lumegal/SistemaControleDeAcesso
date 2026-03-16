import { Feather } from "@expo/vector-icons";
import { Text, View, TextInput, FlatList } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import MenuOptionButton from "../_components/MenuOptionButton";
import { colors } from "../../colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllMotoristas, updateMotorista } from "../../services/motorista";
import { IMotorista } from "../../interfaces/motorista";
import React from "react";
import { IJwtPayload } from "../../interfaces/jwt";
import SimpleModal from "../_components/SimpleModal";
import { useAuth } from "../../context/auth";
import { useLoading } from "../../context/providers/loading";
import { router } from "expo-router";

const renderTableHeader = (
  globalStyles: ReturnType<typeof getGlobalStyles>,
  ordemAsc: boolean,
  onToggleOrdem: () => void,
) => {
  return (
    <View
      style={[globalStyles.mainContainer, { height: 70, alignItems: "center" }]}
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
    onEdit,
  }: {
    motorista: IMotorista;
    usuario?: IJwtPayload | null;
    globalStyles: ReturnType<typeof getGlobalStyles>;
    onEdit: (m: IMotorista) => void;
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
          <Text style={globalStyles.tableColumnText}>{motorista.celular}</Text>
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
            onPress={() => onEdit(motorista)}
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

export default function Motoristas() {
  const { usuario } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const globalStyles = getGlobalStyles();
  const [motoristas, setMotoristas] = useState<IMotorista[]>([]);

  const [motoristaSelecionado, setMotoristaSelecionado] = useState<IMotorista>({
    id: 0,
    nome: "",
    rgCpf: "",
    celular: "",
  });

  const [ordemAsc, setOrdemAsc] = useState(false);

  const [isModalEdicaoVisible, setIsModalEdicaoVisible] =
    useState<boolean>(false);

  const toggleOrdem = () => {
    setOrdemAsc((prev) => !prev);
  };

  const tableHeader = useMemo(
    () => renderTableHeader(globalStyles, ordemAsc, toggleOrdem),
    [usuario, globalStyles, ordemAsc],
  );

  useEffect(() => {
    const getData = async () => {
      const resultado: IMotorista[] = await getAllMotoristas();
      const motoristasOrdenados: IMotorista[] = resultado.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR", {
          sensitivity: "base",
        }),
      );

      setMotoristas(motoristasOrdenados);
    };

    getData();
  }, []);

  const handleEdit = useCallback((motorista: IMotorista) => {
    setMotoristaSelecionado({
      id: motorista.id,
      nome: motorista.nome,
      rgCpf: motorista.rgCpf,
      celular: motorista.celular ?? "",
    });
    setIsModalEdicaoVisible(true);
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
            <CargaRow
              motorista={item}
              globalStyles={globalStyles}
              onEdit={handleEdit}
            />
          )}
        />
      </View>

      <SimpleModal
        visible={isModalEdicaoVisible}
        onClose={() => setIsModalEdicaoVisible(false)}
        title="Editar motorista"
      >
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalLabelInputContainer}>
            <Text style={globalStyles.labelText}>Nome</Text>
            <TextInput
              style={globalStyles.input}
              value={motoristaSelecionado?.nome}
              onChangeText={(text) =>
                setMotoristaSelecionado((prev) => ({ ...prev, nome: text }))
              }
            />
          </View>

          <View style={globalStyles.modalLabelInputContainer}>
            <Text style={globalStyles.labelText}>RG ou CPF</Text>
            <TextInput
              style={globalStyles.input}
              value={motoristaSelecionado?.rgCpf}
              onChangeText={(text) =>
                setMotoristaSelecionado((prev) => ({ ...prev, rgCpf: text }))
              }
            />
          </View>

          <View style={globalStyles.modalLabelInputContainer}>
            <Text style={globalStyles.labelText}>Celular</Text>
            <TextInput
              style={globalStyles.input}
              value={motoristaSelecionado?.celular}
              onChangeText={(text) =>
                setMotoristaSelecionado((prev) => ({ ...prev, celular: text }))
              }
            />
          </View>

          {/* Salvar */}
          <MenuOptionButton
            containerStyle={[
              globalStyles.button,
              { backgroundColor: colors.green },
            ]}
            labelStyle={globalStyles.buttonText}
            label={
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Text style={globalStyles.buttonText} selectable={false}>
                  Salvar
                </Text>
                <Feather
                  name="check-circle"
                  size={24}
                  color="white"
                  style={{ marginBottom: -2 }}
                />
              </View>
            }
            onPress={async () => {
              try {
                showLoading();

                const resultado = await updateMotorista(
                  {
                    nome: motoristaSelecionado?.nome,
                    rgCpf: motoristaSelecionado?.rgCpf,
                    celular: motoristaSelecionado?.celular,
                  },
                  motoristaSelecionado.id,
                );

                alert("Motorista atualizado com sucesso!");
                router.push({
                  pathname: "/main",
                  params: { pageName: "cadastros", subPage: "motoristas" },
                });
              } catch (erro: any) {
                alert(erro.message);
              } finally {
                hideLoading();
              }
            }}
          />
        </View>
      </SimpleModal>
    </View>
  );
}
