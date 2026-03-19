import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  Pressable,
  Animated,
  Modal,
} from "react-native";
import { colors } from "../../colors";
import {
  Feather,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome6,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import MenuOptionButton from "./MenuOptionButton";
import { getGlobalStyles } from "../../globalStyles";
import { useAuth } from "../../context/auth";
import { useRef, useState, useEffect } from "react";
import "../../global.css";

type SideBarProps = {
  visible: boolean;
  closeModal: () => void;
};

export default function SideBar({ closeModal, visible }: SideBarProps) {
  const { usuario } = useAuth();
  const menuIconSize: number = 28;
  const textMainColor: string = "white";
  const params = useLocalSearchParams();

  const globalStyles = getGlobalStyles();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-100)).current;

  const [portariaDropdown, setPortariaDropdown] = useState<boolean>(
    params.pageName === "operacoes" || params.pageName === "cadastros",
  );
  const [almoxarifadoDropdown, setAlmoxarifadoDropdown] = useState<boolean>(
    params.pageName === "almoxarifado",
  );
  const [comercialDropdown, setComercialDropdown] = useState<boolean>(
    params.pageName === "comercial",
  );

  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false); // desmonta só depois
      });
    }
  }, [visible]);

  const styles = StyleSheet.create({
    sideBar: {
      position: "absolute",
      zIndex: 999,
      width: "20%",
      height: "100%",
      backgroundColor: colors.blue,
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center", // vertical
      alignItems: "flex-start", // horizontal
    },
    logo: {
      width: "100%",
      height: "10%",
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
    sectionDropdown: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    menuSection: {
      padding: 12,
      gap: 6,
    },
    menuSectionLabel: {
      color: textMainColor,
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 5,
    },
    menuOptionLabel: {
      color: textMainColor,
      fontSize: 18,
      fontWeight: 600,
    },
    menuIcon: {
      color: textMainColor,
    },
    logoutButton: {
      width: "90%",
      alignSelf: "center",
      marginTop: "auto",
      backgroundColor: "#db2114",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 12,
      padding: 24,
      borderRadius: 12,
      gap: 12,
      ...Platform.select({
        web: {
          transitionDuration: "150ms",
        },
      }),
    },
    version: {
      color: textMainColor,
      textAlign: "center",
      opacity: 0.7,
    },
  });

  if (!internalVisible) return null;

  return (
    <Modal transparent visible={internalVisible} animationType="none">
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity, // anima o fundo também
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
        <Animated.View
          style={[
            styles.sideBar,
            {
              opacity,
              transform: [{ translateX }],
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            nativeID="sidebarScroll"
          >
            {/* PORTARIA DROPDOWN */}
            <View style={styles.menuSection}>
              <Pressable
                style={styles.sectionDropdown}
                onPress={() => setPortariaDropdown(!portariaDropdown)}
              >
                <Text style={styles.menuSectionLabel} selectable={false}>
                  Portaria
                </Text>
                <Entypo
                  name={`chevron-${portariaDropdown ? "up" : "down"}`}
                  size={24}
                  color="white"
                />
              </Pressable>

              {/* Operações */}
              {portariaDropdown && (
                <>
                  <View style={styles.menuSection}>
                    <Text style={styles.menuSectionLabel} selectable={false}>
                      Operações
                    </Text>

                    {/* Nova carga */}
                    {(usuario?.tipoDeAcesso === "adm" ||
                      usuario?.tipoDeAcesso === "portariaEdit") && (
                      <MenuOptionButton
                        containerStyle={[
                          globalStyles.menuOption,
                          {
                            backgroundColor:
                              params.subPage === "novaCarga"
                                ? textMainColor
                                : colors.blue,
                          },
                        ]}
                        hoverStyle={[
                          params.subPage === "novaCarga"
                            ? {}
                            : { backgroundColor: "rgba(255,255,255,0.2)" },
                        ]}
                        pressedStyle={{
                          backgroundColor: "rgba(255,255,255,0.5)",
                        }}
                        labelStyle={[
                          styles.menuOptionLabel,
                          {
                            color:
                              params.subPage === "novaCarga"
                                ? colors.blue
                                : textMainColor,
                          },
                        ]}
                        label="Nova carga"
                        icon={
                          <MaterialIcons
                            name="add-circle-outline"
                            size={menuIconSize}
                            color={
                              params.subPage === "novaCarga"
                                ? colors.blue
                                : textMainColor
                            }
                          />
                        }
                        onPress={() => {
                          router.push({
                            pathname: "/main",
                            params: {
                              pageName: "operacoes",
                              subPage: "novaCarga",
                            },
                          });
                        }}
                      />
                    )}

                    {/* Cargas */}
                    <MenuOptionButton
                      containerStyle={[
                        globalStyles.menuOption,
                        {
                          backgroundColor:
                            params.subPage === "cargas"
                              ? textMainColor
                              : colors.blue,
                        },
                      ]}
                      hoverStyle={[
                        params.subPage === "cargas"
                          ? {}
                          : { backgroundColor: "rgba(255,255,255,0.2)" },
                      ]}
                      pressedStyle={{
                        backgroundColor: "rgba(255,255,255,0.5)",
                      }}
                      labelStyle={[
                        styles.menuOptionLabel,
                        {
                          color:
                            params.subPage === "cargas"
                              ? colors.blue
                              : textMainColor,
                        },
                      ]}
                      label="Cargas"
                      icon={
                        <Feather
                          name="package"
                          size={menuIconSize}
                          color={
                            params.subPage === "cargas"
                              ? colors.blue
                              : textMainColor
                          }
                        />
                      }
                      onPress={() => {
                        router.push({
                          pathname: "/main",
                          params: {
                            pageName: "operacoes",
                            subPage: "cargas",
                          },
                        });
                      }}
                    />
                  </View>

                  {usuario?.tipoDeAcesso === "adm" && (
                    <View style={styles.menuSection}>
                      <Text style={styles.menuSectionLabel} selectable={false}>
                        Cadastros
                      </Text>

                      {/* Motoristas */}
                      <MenuOptionButton
                        containerStyle={[
                          globalStyles.menuOption,
                          {
                            backgroundColor:
                              params.subPage === "motoristas"
                                ? textMainColor
                                : colors.blue,
                          },
                        ]}
                        labelStyle={[
                          styles.menuOptionLabel,
                          {
                            color:
                              params.subPage === "motoristas"
                                ? colors.blue
                                : textMainColor,
                          },
                        ]}
                        label="Motoristas"
                        icon={
                          <FontAwesome
                            name="drivers-license-o"
                            size={menuIconSize}
                            color={
                              params.subPage === "motoristas"
                                ? colors.blue
                                : textMainColor
                            }
                          />
                        }
                        onPress={() => {
                          router.push({
                            pathname: "/main",
                            params: {
                              pageName: "cadastros",
                              subPage: "motoristas",
                            },
                          });
                        }}
                      />

                      {/* Clientes */}
                      <MenuOptionButton
                        containerStyle={[
                          globalStyles.menuOption,
                          {
                            backgroundColor:
                              params.subPage === "clientes"
                                ? textMainColor
                                : colors.blue,
                          },
                        ]}
                        labelStyle={[
                          styles.menuOptionLabel,
                          {
                            color:
                              params.subPage === "clientes"
                                ? colors.blue
                                : textMainColor,
                          },
                        ]}
                        label="Clientes"
                        icon={
                          <MaterialCommunityIcons
                            name="office-building-outline"
                            size={menuIconSize}
                            color={
                              params.subPage === "clientes"
                                ? colors.blue
                                : textMainColor
                            }
                          />
                        }
                        onPress={() => {
                          router.push({
                            pathname: "/main",
                            params: {
                              pageName: "cadastros",
                              subPage: "clientes",
                            },
                          });
                        }}
                      />

                      {/* Veículos */}
                      <MenuOptionButton
                        containerStyle={[
                          globalStyles.menuOption,
                          {
                            backgroundColor:
                              params.subPage === "veiculos"
                                ? textMainColor
                                : colors.blue,
                          },
                        ]}
                        labelStyle={[
                          styles.menuOptionLabel,
                          {
                            color:
                              params.subPage === "veiculos"
                                ? colors.blue
                                : textMainColor,
                          },
                        ]}
                        label="Veículos"
                        icon={
                          <MaterialCommunityIcons
                            name="truck-outline"
                            size={menuIconSize}
                            color={
                              params.subPage === "veiculos"
                                ? colors.blue
                                : textMainColor
                            }
                          />
                        }
                        onPress={() => {
                          router.push({
                            pathname: "/main",
                            params: {
                              pageName: "cadastros",
                              subPage: "veiculos",
                            },
                          });
                        }}
                      />
                    </View>
                  )}
                </>
              )}
            </View>

            {/* ALMOXARIFADO DROPDOWN */}
            <View style={styles.menuSection}>
              <Pressable
                style={styles.sectionDropdown}
                onPress={() => setAlmoxarifadoDropdown(!almoxarifadoDropdown)}
              >
                <Text style={styles.menuSectionLabel} selectable={false}>
                  Almoxarifado
                </Text>
                <Entypo
                  name={`chevron-${almoxarifadoDropdown ? "up" : "down"}`}
                  size={24}
                  color="white"
                />
              </Pressable>

              {almoxarifadoDropdown && (
                <>
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "itens"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "itens"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                    }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "itens"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Itens"
                    icon={
                      <Entypo
                        name="archive"
                        size={menuIconSize}
                        color={
                          params.subPage === "itens"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "almoxarifado",
                          subPage: "itens",
                        },
                      });
                    }}
                  />

                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "registrarItem"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "registrarItem"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                    }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "registrarItem"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Registrar item"
                    icon={
                      <FontAwesome6
                        name="box-open"
                        size={menuIconSize}
                        color={
                          params.subPage === "registrarItem"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "almoxarifado",
                          subPage: "registrarItem",
                        },
                      });
                    }}
                  />

                  {/* Entrada/Saída */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "entradaSaida"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "entradaSaida"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                    }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "entradaSaida"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Entrada/Saída"
                    icon={
                      <MaterialCommunityIcons
                        name="archive-edit"
                        size={menuIconSize}
                        color={
                          params.subPage === "entradaSaida"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "almoxarifado",
                          subPage: "entradaSaida",
                        },
                      });
                    }}
                  />

                  {/* Pesquisar */}
                  {/* <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "pesquisar"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "pesquisar"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                    }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "pesquisar"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Pesquisar"
                    icon={
                      <FontAwesome5
                        name="search"
                        size={menuIconSize}
                        color={
                          params.subPage === "pesquisar"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "almoxarifado",
                          subPage: "pesquisar",
                        },
                      });
                    }}
                  /> */}

                  {/* Relatórios */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "relatorios"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "relatorios"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                    }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "relatorios"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Relatórios"
                    icon={
                      <Ionicons
                        name="document"
                        size={menuIconSize}
                        color={
                          params.subPage === "relatorios"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "almoxarifado",
                          subPage: "relatorios",
                        },
                      });
                    }}
                  />
                </>
              )}
            </View>

            {/* COMERCIAL DROPDOWN */}
            <View style={styles.menuSection}>
              <Pressable
                style={styles.sectionDropdown}
                onPress={() => setComercialDropdown(!comercialDropdown)}
              >
                <Text style={styles.menuSectionLabel} selectable={false}>
                  Comercial
                </Text>
                <Entypo
                  name={`chevron-${comercialDropdown ? "up" : "down"}`}
                  size={24}
                  color="white"
                />
              </Pressable>

              {comercialDropdown && (
                <>
                  {/* Novo orçamento */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "novoOrcamento"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "novoOrcamento"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                    }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "novoOrcamento"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Novo orçamento"
                    icon={
                      <Entypo
                        name="new-message"
                        size={menuIconSize}
                        color={
                          params.subPage === "novoOrcamento"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "comercial",
                          subPage: "novoOrcamento",
                        },
                      });
                    }}
                  />

                  {/* Orçamentos */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "orcamentos"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "orcamentos"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                    }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "orcamentos"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Orçamentos"
                    icon={
                      <FontAwesome5
                        name="database"
                        size={menuIconSize}
                        color={
                          params.subPage === "orcamentos"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "comercial",
                          subPage: "orcamentos",
                        },
                      });
                    }}
                  />
                </>
              )}
            </View>

            <Text
              style={[styles.version, { marginTop: "auto" }]}
              selectable={false}
            >
              {usuario?.tipoDeAcesso}
            </Text>

            <Text style={styles.version} selectable={false}>
              {`BASE DE TESTES
V2.3.0`}
            </Text>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
