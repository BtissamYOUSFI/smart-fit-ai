import api from "./api";
import { ProgramWeek } from "@/app/shared/model/ProgramWeek";
import { ApiError } from "./trainingProgramApi";

function handleError(error: any): never {
    if (error.response) throw new ApiError(error.response.status, error.response.data?.message ?? "Request failed.");
    if (error.request)  throw new ApiError(0, "Network error.");
    throw new ApiError(-1, error.message ?? "Unknown error.");
}

export async function fetchOrGenerateWeek(programId: number, weekNumber: number): Promise<ProgramWeek> {
    try {
        const res = await api.get(`/program-week/program/${programId}/week/${weekNumber}`);
        return res.data;
    } catch (e: any) { handleError(e); }
}

export async function fetchWeekById(id: number): Promise<ProgramWeek> {
    try {
        const res = await api.get(`/program-week/id/${id}`);
        return res.data;
    } catch (e: any) { handleError(e); }
}
