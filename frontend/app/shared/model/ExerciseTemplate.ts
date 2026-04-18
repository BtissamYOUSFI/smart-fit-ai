export type ExerciseType =
  | "SQUAT" | "PUSH_UP" | "LUNGE"
  | "DEADLIFT" | "PLANK" | "PULL_UP";

export interface ExerciseTemplate {
  id: number;
  exerciseType: ExerciseType;
  plannedReps: number;
  orderInSession: number;
  sessionTemplateId: number;
}
