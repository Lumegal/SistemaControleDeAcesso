import { FontAwesome } from "@expo/vector-icons";
import { FormTitle } from "../_components/FormTitle";

export default function Motoristas() {
  return (
    <>
      <FormTitle
        icon={
          <FontAwesome name="drivers-license-o" size={40} color={"white"} />
        }
        title="Motoristas"
      />
    </>
  );
}
