export interface AnalysisError {
  joint: string;
  occurrences: number;
  avgAngle: number;
  worstAngle: number;
  range: [number, number];
  message: string;
}

export interface AnalysisResult {
  id: number;
  globalScore: number;
  exerciseName: string;
  framesAnalyzed: number;
  errors: AnalysisError[];
  feedback: string[];
  analyzedAt: string;
  exerciseRepId: number;
}
