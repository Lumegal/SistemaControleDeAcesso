import { Slot } from "expo-router";
import { AuthProvider } from "../context/auth";

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
