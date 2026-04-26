export interface AnalysisResult {
  id: number;
  avgKneeAngle: number;
  avgHipAngle: number;
  avgBackAngle: number;
  stabilityScore: number;
  amplitudeScore: number;
  detectedErrors: string[];
  feedback: string;
  analyzedAt: string;
  globalScore: number;
  exerciseId: number;
}
