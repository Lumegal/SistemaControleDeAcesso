import { Feather } from "@expo/vector-icons";
import { FormTitle } from "../_components/FormTitle";

export default function Cargas() {
  return (
    <>
      <FormTitle
        icon={<Feather name="package" size={40} color={"white"} />}
        title="Cargas"
      />
    </>
  );
}
