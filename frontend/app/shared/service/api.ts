import axios from "axios";
import { API_URL } from "@/constants/config";
import { tokenStorage } from "@/utils/tokenStorage";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

let _onAuthError: (() => void) | null = null;

export function setAuthErrorHandler(handler: () => void) {
    _onAuthError = handler;
}

api.interceptors.request.use(async (config) => {
    const token = await tokenStorage.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // For FormData, remove the default Content-Type so the browser sets
    // multipart/form-data with the correct boundary automatically
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            await tokenStorage.delete();
            _onAuthError?.();
        }
        return Promise.reject(error);
    }
);

export default api;
