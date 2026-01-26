import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FormTitle } from "../_components/FormTitle";

export default function Veiculos() {
  return (
    <>
      <FormTitle
        icon={
          <MaterialCommunityIcons
            name="truck-outline"
            size={40}
            color={"white"}
          />
        }
        title="Veiculos"
      />
    </>
  );
}
