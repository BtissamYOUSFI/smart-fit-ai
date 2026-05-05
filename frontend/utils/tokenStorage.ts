import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "token";

export const tokenStorage = {
    save: async (token: string) => {
        if (Platform.OS === "web") {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } else {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        }
    },
    get: async (): Promise<string | null> => {
        if (Platform.OS === "web") {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } else {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        }
    },
    delete: async () => {
        if (Platform.OS === "web") {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    },
    
};