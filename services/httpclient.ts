import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { io } from "socket.io-client";

const api = "http://192.168.0.64:3001";

export async function httpClient(endpoint: string, options: RequestInit) {
  console.log(api)
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${api}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Lê como texto primeiro
  const text = await response.text();

  // Se não tiver nada, vira null
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 403) {
      router.push("/");
      throw new Error("Sessão expirada. Faça login novamente.");
    } else {
      throw new Error(data?.message || "Erro na requisição");
    }
  }

  return data;
}

export const socket = io(api);
