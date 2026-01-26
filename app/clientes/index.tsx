import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FormTitle } from "../_components/FormTitle";

export default function Clientes() {
  return (
    <>
      <FormTitle
        icon={
          <MaterialCommunityIcons
            name="office-building-outline"
            size={40}
            color={"white"}
          />
        }
        title="Clientes"
      />
    </>
  );
}
