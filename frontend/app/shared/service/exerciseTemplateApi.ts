import api from "./api";
import { ExerciseTemplate } from "@/app/shared/model/ExerciseTemplate";
import { ApiError } from "./trainingProgramApi";

function handleError(error: any): never {
    if (error.response) throw new ApiError(error.response.status, error.response.data?.message ?? "Request failed.");
    if (error.request)  throw new ApiError(0, "Network error.");
    throw new ApiError(-1, error.message ?? "Unknown error.");
}

export async function createExerciseTemplate(
    dto: Omit<ExerciseTemplate, "id">
): Promise<ExerciseTemplate> {
    try {
        const res = await api.post("/exercise-template/", dto);
        return res.data;
    } catch (e: any) { handleError(e); }
}

export async function deleteExerciseTemplate(id: number): Promise<void> {
    try {
        await api.delete(`/exercise-template/id/${id}`);
    } catch (e: any) { handleError(e); }
}
