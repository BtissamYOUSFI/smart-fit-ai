export type ExerciseType = "SQUAT" | "PUSHUP" | "BICEP" | "PLANK";

export interface ExerciseTemplate {
  id: number;
  exerciseType: ExerciseType;
  sets: number;
  repsPerSet: number;
  orderInSession: number;
  sessionTemplateId: number;
}
