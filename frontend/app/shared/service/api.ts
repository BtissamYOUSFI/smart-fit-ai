import axios from "axios";
import { API_URL } from "@/constants/config";
import { tokenStorage } from "@/utils/tokenStorage";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
    const token = await tokenStorage.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;