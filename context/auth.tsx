// context/auth.tsx
import React, { createContext, useContext, useState } from "react";
import { router } from "expo-router";
import IUsuario from "../interfaces/Usuario";

interface IAuthContext {
  usuario: IUsuario;
  setUsuario: (usuario: IUsuario) => void;
  handleLogin: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<IUsuario>({ email: "", senha: "" });

  function handleLogin() {
    if (usuario && usuario.email === "admin" && usuario.senha === "admin") {
      router.push("home");
    } else {
      alert("Usuário ou senha inválidos");
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, handleLogin, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
