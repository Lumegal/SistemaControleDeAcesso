import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";

interface FormTitleProps {
  icon: React.ReactNode;
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export default function FormTitle({
  icon,
  title,
  containerStyle,
  titleStyle,
}: FormTitleProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon}
      <Text style={[styles.title, titleStyle]} selectable={false}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5789f3",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 24,
    gap: 8,
  },
  title: {
    color: "white",
    fontWeight: "500",
    fontSize: 24,
  },
});
