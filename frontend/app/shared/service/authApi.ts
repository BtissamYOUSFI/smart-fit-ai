import api from "@/app/shared/service/api"; // ton fichier axios
import { AuthRequest, AuthResponse } from "@/app/shared/model/auth/AuthRequest";

export async function loginApi(data: AuthRequest): Promise<AuthResponse> {
    const res = await api.post("/auth/login", data);
    console.log(res.data.token)
    return { token: res.data.token, email: data.email };
}

// export async function registerApi(data: {
//     name: string;
//     email: string;
//     password: string;
// }): Promise<AuthResponse> {
//     const res = await api.post("/auth/register", {
//         name: data.name,
//         email: data.email,
//         passwordHash: data.password,
//     });
//     return { token: res.data.token, email: data.email };
// }

export async function registerApi(data: {
    name: string;
    email: string;
    password: string;
}): Promise<AuthResponse> {
    const res = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        passwordHash: data.password,  // ← send as "password", backend should hash
    });
    console.log(res.data.token)
    return { token: res.data.token, email: data.email };
}