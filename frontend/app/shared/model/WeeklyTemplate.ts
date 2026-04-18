import { SessionTemplate } from "./SessionTemplate";

export type RepeatMode = "EVERY_WEEK" | "EVERY_TWO_WEEKS" | "MONTHLY";

export interface WeeklyTemplate {
  id: number;
  label: string;
  repeatMode: RepeatMode;
  weekOfMonth: number;
  trainingProgramId: number;
  sessionTemplates: SessionTemplate[];
}
