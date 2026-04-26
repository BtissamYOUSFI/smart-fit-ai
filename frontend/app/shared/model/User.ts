import { TrainingProgram } from "./TrainingProgram";

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  programs: TrainingProgram[];
}
