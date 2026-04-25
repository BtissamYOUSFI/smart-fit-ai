import mediapipe as mp
import numpy as np
import cv2
from dataclasses import dataclass
from typing import List, Optional

mp_pose = mp.solutions.pose

@dataclass
class Landmark3D:
    x: float
    y: float
    z: float
    visibility: float

@dataclass
class PoseLandmarks:
    landmarks: List[Landmark3D]

    def get(self, idx: int) -> Landmark3D:
        return self.landmarks[idx]

    def as_array(self, idx: int) -> np.ndarray:
        lm = self.landmarks[idx]
        return np.array([lm.x, lm.y, lm.z])


LM = mp_pose.PoseLandmark


class PoseExtractor:
    def __init__(self):
        self.pose = mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def extract(self, frame: np.ndarray) -> Optional[PoseLandmarks]:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self.pose.process(rgb)

        if not result.pose_landmarks:
            return None

        lms = [
            Landmark3D(x=lm.x, y=lm.y, z=lm.z, visibility=lm.visibility)
            for lm in result.pose_landmarks.landmark
        ]
        return PoseLandmarks(landmarks=lms)

    def close(self):
        self.pose.close()
