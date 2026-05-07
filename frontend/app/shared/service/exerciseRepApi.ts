import api from "./api";
import { ExerciseRep } from "@/app/shared/model/ExerciseRep";
import { ApiError } from "./trainingProgramApi";

function handleError(error: any): never {
    if (error.response) throw new ApiError(error.response.status, error.response.data?.message ?? "Request failed.");
    if (error.request)  throw new ApiError(0, "Network error.");
    throw new ApiError(-1, error.message ?? "Unknown error.");
}

export async function fetchRepsByExercise(exerciseId: number): Promise<ExerciseRep[]> {
    try {
        const res = await api.get(`/exercise-rep/exercise/${exerciseId}`);
        return res.data;
    } catch (e: any) { handleError(e); }
}

export async function fetchRepById(id: number): Promise<ExerciseRep> {
    try {
        const res = await api.get(`/exercise-rep/id/${id}`);
        return res.data;
    } catch (e: any) { handleError(e); }
}

/**
 * Upload a video for a rep.
 * Accepts either a browser File object (web) or a React Native file reference (native).
 */
export async function analyzeRepVideo(
    repId: number,
    file: File | { uri: string; name: string; type: string }
): Promise<ExerciseRep> {
    try {
        const formData = new FormData();
        formData.append("file", file as any);
        // Do NOT set Content-Type manually — the browser/axios must include the boundary
        const res = await api.post(`/exercise-rep/id/${repId}/analyze`, formData);
        return res.data;
    } catch (e: any) { handleError(e); }
}
