export type CaptureMode = "LIVE" | "UPLOAD";

export interface VideoCapture {
  id: number;
  sourceMode: CaptureMode;
  filePath: string;
  durationSeconds: number;
  uploadedAt: string;
  exerciseId: number;
}
