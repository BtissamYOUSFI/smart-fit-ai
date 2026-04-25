import { Exercise } from "./Exercise";
import { DayOfWeek } from "./SessionTemplate";

export type SessionStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";

export interface Session {
  id: number;
  dayOfWeek: DayOfWeek;
  scheduledDate: string;
  status: SessionStatus;
  globalScore: number;
  programWeekId: number;
  exercises: Exercise[];
}
