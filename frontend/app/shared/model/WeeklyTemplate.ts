import { SessionTemplate } from "./SessionTemplate";

export type RepeatMode = "ALL_WEEKS" | "BY_WEEK_OF_MONTH" | "INDEPENDENT";

export interface WeeklyTemplate {
  id: number;
  label: string;
  repeatMode: RepeatMode;
  weekOfMonth: number | null;
  trainingProgramId: number;
  sessionTemplates: SessionTemplate[];
}
