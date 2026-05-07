import { VideoCapture } from "./VideoCapture";
import { AnalysisResult } from "./AnalysisResult";

export interface ExerciseRep {
  id: number;
  repNumber: number;
  exerciseId: number;
  videoCapture: VideoCapture | null;
  analysisResult: AnalysisResult | null;
}
