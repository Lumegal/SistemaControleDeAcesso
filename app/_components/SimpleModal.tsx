import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  View,
} from "react-native";
import MenuOptionButton from "./MenuOptionButton";
import { getGlobalStyles } from "../../globalStyles";
import { colors } from "../../colors";

interface Props {
  maxWidth?: number;
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeButtonColor?: string;
}

export default function SimpleModal({
  maxWidth = 500,
  visible,
  onClose,
  title,
  children,
  closeButtonColor = colors.red,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  const [internalVisible, setInternalVisible] = useState(visible);
  const globalStyles = getGlobalStyles();

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
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
        Animated.timing(translateY, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false); // desmonta só depois
      });
    }
  }, [visible]);

  if (!internalVisible) return null;

  return (
    <Modal transparent visible animationType="none">
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity, // anima o fundo também
          },
        ]}
      >
        {/* clique fora fecha */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[
            styles.container,
            {
              opacity,
              transform: [{ translateY }],
              maxWidth: maxWidth
            },
          ]}
        >
          {title && <Text style={styles.title}>{title}</Text>}

          {children}

          <MenuOptionButton
            containerStyle={[
              globalStyles.button,
              { backgroundColor: closeButtonColor },
            ]}
            labelStyle={globalStyles.buttonText}
            label={
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Text style={globalStyles.buttonText} selectable={false}>
                  Fechar
                </Text>
                <AntDesign
                  name="close-circle"
                  size={24}
                  color="white"
                  style={{ marginBottom: -3 }}
                />
              </View>
            }
            onPress={onClose}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center", // vertical
    alignItems: "center", // horizontal
  },
  container: {
    width: "85%",
    minHeight: 120,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    gap: 20,
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
  closeText: {
    fontWeight: "bold",
  },
});
