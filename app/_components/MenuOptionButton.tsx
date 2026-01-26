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
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  onPress: () => void;
}

export function MenuOptionButton({
  containerStyle,
  hoverStyle = { opacity: 0.7 },
  pressedStyle = { opacity: 0.5 },
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
