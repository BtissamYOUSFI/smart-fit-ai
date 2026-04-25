import { WeeklyTemplate } from "./WeeklyTemplate";
import { ProgramWeek } from "./ProgramWeek";

export interface TrainingProgram {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  userEmail: string;
  weeklyTemplates: WeeklyTemplate[];
  programWeeks: ProgramWeek[];
}
