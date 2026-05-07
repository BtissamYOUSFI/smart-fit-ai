import { ExerciseType } from "./ExerciseTemplate";
import { ExerciseRep } from "./ExerciseRep";

export interface Exercise {
  id: number;
  exerciseType: ExerciseType;
  plannedSets: number;
  plannedRepsPerSet: number;
  score: number | null;
  orderInSession: number;
  sessionId: number;
  reps: ExerciseRep[];
}
