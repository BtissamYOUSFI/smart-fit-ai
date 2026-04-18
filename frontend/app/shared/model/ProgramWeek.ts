import { TrainingProgram } from "./TrainingProgram";
import { WeeklyTemplate } from "./WeeklyTemplate";
import { Session } from "./Session";

export interface ProgramWeek {
  id: number;
  weekNumber: number;
  startDate: string;
  isCustomized: boolean;
  trainingProgram: TrainingProgram;
  weeklyTemplate: WeeklyTemplate;
  sessions: Session[];
}
