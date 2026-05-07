import api from "./api";
import { WeeklyTemplate } from "@/app/shared/model/WeeklyTemplate";
import { ApiError } from "./trainingProgramApi";

function handleError(error: any): never {
    if (error.response) throw new ApiError(error.response.status, error.response.data?.message ?? "Request failed.");
    if (error.request)  throw new ApiError(0, "Network error.");
    throw new ApiError(-1, error.message ?? "Unknown error.");
}

export async function createWeeklyTemplate(
    dto: Omit<WeeklyTemplate, "id" | "sessionTemplates">
): Promise<WeeklyTemplate> {
    try {
        const res = await api.post("/weekly-template/add-one", dto);
        return res.data;
    } catch (e: any) { handleError(e); }
}

export async function fetchWeeklyTemplateById(id: number): Promise<WeeklyTemplate> {
    try {
        const res = await api.get(`/weekly-template/id/${id}`);
        return res.data;
    } catch (e: any) { handleError(e); }
}

export async function deleteWeeklyTemplate(id: number): Promise<void> {
    try {
        await api.delete(`/weekly-template/id/${id}`);
    } catch (e: any) { handleError(e); }
}
