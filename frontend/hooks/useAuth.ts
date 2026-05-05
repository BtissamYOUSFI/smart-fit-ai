// import { useState, useEffect } from "react";
// import { useRouter } from "expo-router";
// import { tokenStorage } from "@/utils/tokenStorage";
// import { loginApi, registerApi } from "@/app/shared/service/authApi";
//
// export function useAuth() {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//
//     useEffect(() => {
//         const checkToken = async () => {
//             const token = await tokenStorage.get();
//             if (token) {
//                 setIsAuthenticated(true);
//                 router.replace("/(tabs)/pages/dashboard");
//             } else {
//                 setIsAuthenticated(false);
//                 router.replace("/auth/login");
//             }
//         };
//         checkToken();
//     }, []);
//
//     const login = async (email: string, password: string) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await loginApi({ email, password });
//             const token = res.token;
//             if (!token) throw new Error("Token manquant");
//             await tokenStorage.save(token);
//             setIsAuthenticated(true);
//             router.replace("/(tabs)/pages/dashboard");
//         } catch (e: any) {
//             setError(e.response?.data?.message ?? e.message ?? "Erreur inconnue");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const register = async (name: string, email: string, password: string) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await registerApi({ name, email, password });
//             const token = res.token;
//             if (!token) throw new Error("Token manquant");
//             await tokenStorage.save(token);
//             setIsAuthenticated(true);
//             router.replace("/(tabs)/pages/dashboard");
//         } catch (e: any) {
//             setError(e.response?.data?.message ?? e.message ?? "Erreur inconnue");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const logout = async () => {
//         await tokenStorage.delete();
//         setIsAuthenticated(false);
//         router.replace("/auth/login");
//     };
//
//     return { login, register, logout, loading, error, isAuthenticated };
// }


import { useState, useEffect } from "react";
import { tokenStorage } from "@/utils/tokenStorage";
import { loginApi, registerApi } from "@/app/shared/service/authApi";

export function useAuth() {
    const [isLoading, setIsLoading] = useState(true);   // ← starts true, blocks redirect
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await tokenStorage.get();
                setIsAuthenticated(!!token);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);  // ← only now layout is allowed to redirect
            }
        };
        checkToken();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginApi({ email, password });
            const token = res.token;
            if (!token) throw new Error("Token manquant");
            await tokenStorage.save(token);
            setIsAuthenticated(true);  // ← layout reacts and redirects
        } catch (e: any) {
            setError(e.response?.data?.message ?? e.message ?? "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await registerApi({ name, email, password });
            const token = res.token;
            if (!token) throw new Error("Token manquant");
            await tokenStorage.save(token);
            setIsAuthenticated(true);  // ← layout reacts and redirects
        } catch (e: any) {
            setError(e.response?.data?.message ?? e.message ?? "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await tokenStorage.delete();
        setIsAuthenticated(false);  // ← layout reacts and redirects
    };

    return { login, register, logout, loading, isLoading, error, isAuthenticated };
}