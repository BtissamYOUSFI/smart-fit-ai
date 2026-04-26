import axios from "axios";
import {API_URL} from "@/constants/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;