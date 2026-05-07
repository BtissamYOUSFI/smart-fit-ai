import api from "./api";
import { Session } from "@/app/shared/model/Session";
import { ApiError } from "./trainingProgramApi";

function handleError(error: any): never {
    if (error.response) throw new ApiError(error.response.status, error.response.data?.message ?? "Request failed.");
    if (error.request)  throw new ApiError(0, "Network error.");
    throw new ApiError(-1, error.message ?? "Unknown error.");
}

export async function fetchSessionById(id: number): Promise<Session> {
    try {
        const res = await api.get(`/session/id/${id}`);
        return res.data;
    } catch (e: any) { handleError(e); }
}

export async function updateSessionStatus(id: number, status: Session["status"]): Promise<Session> {
    try {
        const res = await api.patch(`/session/id/${id}/status`, { status });
        return res.data;
    } catch (e: any) { handleError(e); }
}
