import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { tokenStorage } from "@/utils/tokenStorage";
import { loginApi, registerApi } from "@/app/shared/service/authApi";
import { setAuthErrorHandler } from "@/app/shared/service/api";

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading]             = useState(true);
    const [loading, setLoading]                 = useState(false);
    const [error, setError]                     = useState<string | null>(null);
    const clearError = () => setError(null);

    useEffect(() => {
        setAuthErrorHandler(() => {
            setIsAuthenticated(false);
        });
        (async () => {
            try {
                const token = await tokenStorage.get();
                setIsAuthenticated(!!token);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginApi({ email, password });
            await tokenStorage.save(res.token);
            await tokenStorage.saveEmail(res.email);
            setIsAuthenticated(true);
        } catch (e: any) {
            setError(e.response?.data?.message ?? e.message ?? "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await registerApi({ name, email, password });
            await tokenStorage.save(res.token);
            await tokenStorage.saveEmail(res.email);
            setIsAuthenticated(true);
        } catch (e: any) {
            setError(e.response?.data?.message ?? e.message ?? "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await tokenStorage.delete();
        await tokenStorage.saveEmail("");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, loading, error, login, register, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
