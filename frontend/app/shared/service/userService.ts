import api from "@/app/shared/service/api"
import { User } from "@/app/shared/model";

export async function findByEmail(email: string): Promise<User> {
    const res = await api.get(`/user/email/${email}`);
    return res.data;
}

export async function updateUser(user: User): Promise<User> {
    const res = await api.put("/user/update", user);
    return res.data;
}

export async function getAuthenticatedUser(): Promise<User> {
    const res = await api.get("/user/me");
    return res.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.patch("/user/me/password", { currentPassword, newPassword });
}