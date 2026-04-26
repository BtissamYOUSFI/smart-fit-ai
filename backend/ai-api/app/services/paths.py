from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

BEST_MODEL = ROOT / "models/training-result/best.pt"
LSTM_MODEL = ROOT / "models/training-result/lstm_best.tflite"