export type CaptureMode = "UPLOAD" | "LIVE_CAMERA";

export interface VideoCapture {
  id: number;
  sourceMode: CaptureMode;
  filePath: string;
  durationSeconds: number | null;
  uploadedAt: string;
  exerciseRepId: number;
}
