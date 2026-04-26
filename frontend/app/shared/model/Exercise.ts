import { ExerciseType } from "./ExerciseTemplate";
import { AnalysisResult } from "./AnalysisResult";
import { VideoCapture } from "./VideoCapture";

export interface Exercise {
  id: number;
  exerciseType: ExerciseType;
  plannedReps: number;
  performedReps: number;
  score: number;
  orderInSession: number;
  sessionId: number;
  analysisResult: AnalysisResult;
  videoCapture: VideoCapture;
}
