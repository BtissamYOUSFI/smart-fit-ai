import api from "./api";
import { SessionTemplate } from "@/app/shared/model/SessionTemplate";
import { ApiError } from "./trainingProgramApi";

function handleError(error: any): never {
    if (error.response) throw new ApiError(error.response.status, error.response.data?.message ?? "Request failed.");
    if (error.request)  throw new ApiError(0, "Network error.");
    throw new ApiError(-1, error.message ?? "Unknown error.");
}

export async function createSessionTemplate(
    dto: Omit<SessionTemplate, "id" | "exerciseTemplates">
): Promise<SessionTemplate> {
    try {
        const res = await api.post("/session-template/", dto);
        return res.data;
    } catch (e: any) { handleError(e); }
}

export async function fetchSessionTemplateById(id: number): Promise<SessionTemplate> {
    try {
        const res = await api.get(`/session-template/id/${id}`);
        return res.data;
    } catch (e: any) { handleError(e); }
}
