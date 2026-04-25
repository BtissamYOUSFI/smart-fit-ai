from ultralytics import YOLO
import numpy as np
import torch
from ultralytics.nn.tasks import PoseModel

torch.serialization.add_safe_globals([PoseModel])

from app.services.paths import BEST_MODEL

CLASS_NAMES = {
    0: "bicep",
    1: "squat",
    2: "pushup",
    3: "plank"
}

class YOLODetector:
    def __init__(self, weights_path: str = str(BEST_MODEL)):
        self.model = YOLO(weights_path)
        # NOTE: do NOT call self.model.fuse() — breaks Pose head

    def detect(self, frame: np.ndarray) -> dict | None:
        results = self.model.predict(frame, verbose=False)[0]

        if results.boxes is None or len(results.boxes) == 0:
            return None

        idx = results.boxes.conf.argmax()
        cls  = int(results.boxes.cls[idx])
        conf = float(results.boxes.conf[idx])
        bbox = results.boxes.xyxy[idx].cpu().numpy()

        kps = None
        vis = None
        if results.keypoints is not None:
            kps = results.keypoints.xy[idx].cpu().numpy().tolist()
            vis = results.keypoints.conf[idx].cpu().numpy().tolist()

        return {
            "class_id":    cls,
            "class_name":  CLASS_NAMES.get(cls, "unknown"),
            "confidence":  conf,
            "bbox":        bbox.tolist(),
            "keypoints_17": kps,
            "visibility":  vis
        }
