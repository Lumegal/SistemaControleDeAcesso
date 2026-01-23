import {
  Pressable,
  Text,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

interface MenuOptionButtonProps {
  containerStyle: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

export function MenuOptionButton({
  containerStyle,
  hoverStyle = { backgroundColor: "rgba(255,255,255,0.2)" },
  pressedStyle = { backgroundColor: "rgba(255,255,255,0.5)" },
  labelStyle,
  label,
  icon,
  onPress,
}: MenuOptionButtonProps) {
  return (
    <Pressable
      style={(state: any) => [
        containerStyle,
        Platform.OS === "web" && state.hovered && hoverStyle,
        state.pressed && pressedStyle,
      ]}
      onPress={onPress}
    >
      {icon}
      <Text style={labelStyle} selectable={false}>
        {label}
      </Text>
    </Pressable>
  );
}
