import api from "@/app/shared/service/api";
import { TrainingProgram } from "@/app/shared/model/TrainingProgram";

export class ApiError extends Error {
    constructor(public readonly status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

function handleAxiosError(error: any): never {
    if (error.response) {
        const status: number = error.response.status;
        const msg: string = error.response.data?.message ?? error.response.data ?? "An unexpected error occurred.";
        switch (status) {
            case 400: throw new ApiError(400, `Bad request: ${msg}`);
            case 401: throw new ApiError(401, "Unauthorized. Please log in again.");
            case 403: throw new ApiError(403, "You don't have permission to perform this action.");
            case 404: throw new ApiError(404, "Program not found.");
            case 409: throw new ApiError(409, msg);
            case 500: throw new ApiError(500, "Server error. Please try again later.");
            default:  throw new ApiError(status, msg);
        }
    } else if (error.request) {
        throw new ApiError(0, "Network error. Please check your connection.");
    } else {
        throw new ApiError(-1, error.message ?? "Unknown error.");
    }
}

/** Programs belonging to the authenticated user. */
export async function fetchMyPrograms(): Promise<TrainingProgram[]> {
    try {
        const res = await api.get("/training-program/my");
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 204) return [];
        handleAxiosError(error);
    }
}

/** Active program for the authenticated user (today within start–end). */
export async function fetchActiveProgram(): Promise<TrainingProgram | null> {
    try {
        const res = await api.get("/training-program/my/active");
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 204) return null;
        handleAxiosError(error);
    }
}

export async function fetchAllPrograms(): Promise<TrainingProgram[]> {
    try {
        const res = await api.get("/training-program/all");
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 204) return [];
        handleAxiosError(error);
    }
}

export async function fetchProgramById(id: number): Promise<TrainingProgram> {
    try {
        const res = await api.get(`/training-program/id/${id}`);
        return res.data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function createProgram(program: Omit<TrainingProgram, "id">): Promise<TrainingProgram> {
    try {
        const res = await api.post("/training-program/add-one", program);
        return res.data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function updateProgram(program: TrainingProgram): Promise<TrainingProgram> {
    try {
        const res = await api.put("/training-program/update", program);
        return res.data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function patchProgram(
    id: number,
    updates: { title?: string; startDate?: string; endDate?: string }
): Promise<TrainingProgram> {
    try {
        const res = await api.patch(`/training-program/id/${id}`, updates);
        return res.data;
    } catch (error: any) {
        handleAxiosError(error);
    }
}

export async function deleteProgramById(id: number): Promise<void> {
    try {
        await api.delete(`/training-program/id/${id}`);
    } catch (error: any) {
        handleAxiosError(error);
    }
}
