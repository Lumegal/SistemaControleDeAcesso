import React, { createContext, ReactNode, useContext, useState } from "react";
import { ILoginRequest } from "../interfaces/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../services/httpclient";

interface IAuthContext {
  isAuthenticated: boolean;
  login: (usuario: ILoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (usuario: ILoginRequest) => {
    const response = await httpClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(usuario),
    });

    const token: string = response.token;

    await AsyncStorage.setItem("token", token);
    setIsAuthenticated(true);

    if (token === "Usuário ou senha inválidos") {
      throw new Error("Usuário ou senha inválidos");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
