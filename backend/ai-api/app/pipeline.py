import cv2
import numpy as np
from collections import Counter, defaultdict
from app.models.yolo_detector   import YOLODetector
from app.models.pose_extractor  import PoseExtractor
from app.models.lstm_classifier import LSTMClassifier
from app.analysis.angle_calculator import get_exercise_angles, evaluate_angles, compute_score
from app.services.paths import BEST_MODEL, LSTM_MODEL

ANGLE_TOLERANCE = 2.0  # degrees — avoid flagging near-boundary angles

class AnalysisPipeline:
    def __init__(self):
        self.yolo = YOLODetector(str(BEST_MODEL))
        self.mp   = PoseExtractor()
        self.lstm = LSTMClassifier(str(LSTM_MODEL))

    def analyze_frame(self, frame: np.ndarray) -> dict:
        """Process one frame. Returns analysis result dict."""

        # 1. YOLO: detect exercise class
        yolo_result = self.yolo.detect(frame)
        if yolo_result is None:
            return {"status": "no_person"}

        exercise = yolo_result["class_name"]

        # 2. LSTM: disambiguate plank vs pushup
        if exercise in ("pushup", "plank"):
            pose_for_lstm = self.mp.extract(frame)
            if pose_for_lstm:
                lstm_result = self.lstm.add_frame(pose_for_lstm.landmarks)
                if lstm_result:
                    exercise = lstm_result

        # 3. MediaPipe: precise 3D landmarks
        pose = self.mp.extract(frame)
        if pose is None:
            return {"status": "pose_not_found", "exercise": exercise}

        # 4. Compute joint angles
        angles = get_exercise_angles(pose, exercise)

        # 5. Evaluate with tolerance to avoid near-boundary false positives
        raw_errors = evaluate_angles(angles, exercise)
        errors = [
            e for e in raw_errors
            if e["angle"] < e["range"][0] - ANGLE_TOLERANCE
            or e["angle"] > e["range"][1] + ANGLE_TOLERANCE
        ]

        score = compute_score(errors, len(angles))

        return {
            "status":   "ok",
            "exercise": exercise,
            "score":    score,
            "angles":   angles,
            "errors":   errors,
            "feedback": [e["message"] for e in errors]
        }

    def analyze_video(self, video_path: str) -> dict:
        """Process entire video file. Returns aggregated result."""
        cap = cv2.VideoCapture(video_path)
        frame_results, scores = [], []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            result = self.analyze_frame(frame)
            if result.get("status") == "ok":
                frame_results.append(result)
                scores.append(result["score"])

        cap.release()
        self.lstm.reset()

        if not scores:
            return {"status": "no_frames_analyzed"}

        most_common_exercise = Counter(
            r["exercise"] for r in frame_results
        ).most_common(1)[0][0]

        avg_score = round(np.mean(scores), 1)

        # Deduplicate errors: group by joint
        error_accumulator = defaultdict(lambda: {
            "count": 0, "angles": [], "message": "", "range": []
        })

        for r in frame_results:
            for e in r.get("errors", []):
                key = e["joint"]
                error_accumulator[key]["count"] += 1
                error_accumulator[key]["angles"].append(e["angle"])
                error_accumulator[key]["message"] = e["message"]
                error_accumulator[key]["range"]   = e["range"]

        MIN_OCCURRENCES = 3
        summarized_errors = [
            {
                "joint":       joint,
                "occurrences": data["count"],
                "avg_angle":   round(sum(data["angles"]) / len(data["angles"]), 1),
                "worst_angle": round(min(data["angles"]), 1),
                "range":       data["range"],
                "message":     data["message"]
            }
            for joint, data in error_accumulator.items()
            if data["count"] > MIN_OCCURRENCES
        ]

        return {
            "status":          "ok",
            "exercise":        most_common_exercise,
            "global_score":    avg_score,
            "frames_analyzed": len(frame_results),
            "errors":          summarized_errors,
            "feedback":        list({e["message"] for e in summarized_errors})
        }
