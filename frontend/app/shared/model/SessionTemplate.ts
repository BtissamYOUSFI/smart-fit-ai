import { ExerciseTemplate } from "./ExerciseTemplate";

export type DayOfWeek =
  | "MONDAY" | "TUESDAY" | "WEDNESDAY"
  | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface SessionTemplate {
  id: number;
  dayOfWeek: DayOfWeek;
  orderInWeek: number;
  weeklyTemplateId: number;
  exerciseTemplates: ExerciseTemplate[];
}
