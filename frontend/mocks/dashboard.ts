export const mockDashboard = {
  todayScore: 76.7,
  todayTrend: "up" as const,
  weeklyAvg: 71.3,
  weeklyTrend: "up" as const,
  totalSessions: 12,
  totalTrend: "up" as const,
  recentAnalyses: [
    { id: "a1", exerciseType: "SQUAT", score: 62.4, date: "2025-04-07" },
    { id: "a2", exerciseType: "PLANK", score: 91.0, date: "2025-04-07" },
    { id: "a3", exerciseType: "PUSHUP", score: 74.5, date: "2025-04-10" },
    { id: "a4", exerciseType: "LUNGE", score: 84.2, date: "2025-04-12" },
    { id: "a5", exerciseType: "BICEP", score: 48.0, date: "2025-04-14" },
  ],
};
