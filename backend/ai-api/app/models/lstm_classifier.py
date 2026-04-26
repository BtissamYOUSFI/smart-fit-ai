import numpy as np
from collections import deque
import tensorflow as tf

SEQUENCE_LEN = 30
KEYPOINTS = [11,12,13,14,15,16,23,24]

class LSTMClassifier:
    def __init__(self, model_path: str = "models/training-result/lstm_best.tflite"):
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        self.interpreter = interpreter
        self.input_details  = interpreter.get_input_details()
        self.output_details = interpreter.get_output_details()
        self.buffer = deque(maxlen=SEQUENCE_LEN)

    def add_frame(self, landmarks) -> str | None:
        features = []
        for i in KEYPOINTS:
            lm = landmarks[i]
            features.extend([lm.x, lm.y])
        self.buffer.append(features)

        if len(self.buffer) < SEQUENCE_LEN:
            return None

        X = np.array([list(self.buffer)], dtype=np.float32)  # (1, 30, 16)
        self.interpreter.set_tensor(self.input_details[0]["index"], X)
        self.interpreter.invoke()
        prob = self.interpreter.get_tensor(self.output_details[0]["index"])[0][0]
        return "plank" if prob > 0.5 else "pushup"

    def reset(self):
        self.buffer.clear()
