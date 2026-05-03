export type ExerciseType = "SQUAT" | "PUSHUP" | "PLANK" | "LUNGE" | "BICEP" | "DEADLIFT";

export type ExerciseStatus = "Pending" | "Analyzed" | "Scored" | "InProgress";

export interface Exercise {
  id: string;
  type: ExerciseType;
  plannedReps: number;
  status: ExerciseStatus;
  score?: number;
}

export interface Session {
  id: string;
  name: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  exercises: Exercise[];
  status: "Planned" | "InProgress" | "Completed";
}

export interface Week {
  id: string;
  index: number;
  modified: boolean;
  sessions: Session[];
}

export interface Program {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  completionRate: number;
  globalScore: number;
  status: "Active" | "Completed" | "Upcoming";
  totalWeeks: number;
  scheduleMode: "repeat" | "monthly" | "weekly";
  weeks: Week[];
}

const baseSessions: Session[] = [
  {
    id: "s-mon",
    name: "Lower Body Power",
    day: "Mon",
    status: "Completed",
    exercises: [
      { id: "e1", type: "SQUAT", plannedReps: 12, status: "Scored", score: 78 },
      { id: "e2", type: "LUNGE", plannedReps: 10, status: "Scored", score: 82 },
      { id: "e3", type: "PLANK", plannedReps: 1, status: "Scored", score: 91 },
    ],
  },
  {
    id: "s-wed",
    name: "Upper Body Push",
    day: "Wed",
    status: "InProgress",
    exercises: [
      { id: "e4", type: "PUSHUP", plannedReps: 15, status: "Scored", score: 74 },
      { id: "e5", type: "BICEP", plannedReps: 12, status: "Pending" },
    ],
  },
  {
    id: "s-fri",
    name: "Core & Conditioning",
    day: "Fri",
    status: "Planned",
    exercises: [
      { id: "e6", type: "PLANK", plannedReps: 1, status: "Pending" },
      { id: "e7", type: "SQUAT", plannedReps: 20, status: "Pending" },
    ],
  },
];

const buildWeeks = (count: number): Week[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `w-${i + 1}`,
    index: i + 1,
    modified: i === 2,
    sessions: baseSessions.map((s) => ({ ...s, id: `${s.id}-w${i + 1}` })),
  }));

export const mockPrograms: Program[] = [
  {
    id: "1",
    title: "Summer Strength",
    startDate: "2025-04-07",
    endDate: "2025-06-02",
    completionRate: 45,
    globalScore: 74.2,
    status: "Active",
    totalWeeks: 8,
    scheduleMode: "repeat",
    weeks: buildWeeks(8),
  },
  {
    id: "2",
    title: "Hypertrophy Block",
    startDate: "2025-06-10",
    endDate: "2025-08-05",
    completionRate: 0,
    globalScore: 0,
    status: "Upcoming",
    totalWeeks: 8,
    scheduleMode: "monthly",
    weeks: buildWeeks(8),
  },
  {
    id: "3",
    title: "Winter Foundations",
    startDate: "2025-01-06",
    endDate: "2025-03-30",
    completionRate: 100,
    globalScore: 81.5,
    status: "Completed",
    totalWeeks: 12,
    scheduleMode: "weekly",
    weeks: buildWeeks(12),
  },
];
