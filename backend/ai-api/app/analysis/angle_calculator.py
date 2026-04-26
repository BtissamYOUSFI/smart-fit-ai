import numpy as np
from app.models.pose_extractor import PoseLandmarks, LM

def compute_angle(a: np.ndarray, b: np.ndarray, c: np.ndarray) -> float:
    """
    Compute the angle at point B, formed by vectors B→A and B→C.
    Works in 2D (x,y) or 3D (x,y,z).
    Returns angle in degrees [0, 180].
    """
    ba = a - b   # vector from B to A
    bc = c - b   # vector from B to C

    # cosine formula: cos(θ) = (ba · bc) / (|ba| × |bc|)
    cos_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
    cos_angle = np.clip(cos_angle, -1.0, 1.0)   # avoid arccos domain errors
    return float(np.degrees(np.arccos(cos_angle)))


def get_exercise_angles(pose: PoseLandmarks, exercise: str) -> dict:
    """Compute all relevant angles for a given exercise."""
    angles = {}
    
    if exercise == "bicep":
        # Left arm: shoulder → elbow → wrist
        angles["left_elbow"] = compute_angle(
            pose.as_array(LM.LEFT_SHOULDER),
            pose.as_array(LM.LEFT_ELBOW),
            pose.as_array(LM.LEFT_WRIST)
        )
        # Right arm
        angles["right_elbow"] = compute_angle(
            pose.as_array(LM.RIGHT_SHOULDER),
            pose.as_array(LM.RIGHT_ELBOW),
            pose.as_array(LM.RIGHT_WRIST)
        )
        # Shoulder stability: hip → shoulder → elbow (should be ~10-20°)
        angles["left_shoulder_swing"] = compute_angle(
            pose.as_array(LM.LEFT_HIP),
            pose.as_array(LM.LEFT_SHOULDER),
            pose.as_array(LM.LEFT_ELBOW)
        )

    elif exercise == "squat":
        # Knee angle: hip → knee → ankle
        angles["left_knee"] = compute_angle(
            pose.as_array(LM.LEFT_HIP),
            pose.as_array(LM.LEFT_KNEE),
            pose.as_array(LM.LEFT_ANKLE)
        )
        angles["right_knee"] = compute_angle(
            pose.as_array(LM.RIGHT_HIP),
            pose.as_array(LM.RIGHT_KNEE),
            pose.as_array(LM.RIGHT_ANKLE)
        )
        # Back angle: shoulder → hip → knee (torso lean)
        angles["torso_lean"] = compute_angle(
            pose.as_array(LM.LEFT_SHOULDER),
            pose.as_array(LM.LEFT_HIP),
            pose.as_array(LM.LEFT_KNEE)
        )

    elif exercise == "pushup":
        # Elbow angle: shoulder → elbow → wrist
        angles["left_elbow"] = compute_angle(
            pose.as_array(LM.LEFT_SHOULDER),
            pose.as_array(LM.LEFT_ELBOW),
            pose.as_array(LM.LEFT_WRIST)
        )
        # Body alignment: shoulder → hip → ankle (should be ~180° = straight body)
        angles["body_alignment"] = compute_angle(
            pose.as_array(LM.LEFT_SHOULDER),
            pose.as_array(LM.LEFT_HIP),
            pose.as_array(LM.LEFT_ANKLE)
        )

    elif exercise == "plank":
        # Body alignment: same as push-up (should stay ~180° throughout)
        angles["body_alignment"] = compute_angle(
            pose.as_array(LM.LEFT_SHOULDER),
            pose.as_array(LM.LEFT_HIP),
            pose.as_array(LM.LEFT_ANKLE)
        )
        # Hip sag detection: if < 160° → hips too low
        # If > 200° → hips too high (pike)

    return angles


# ── REFERENCE RANGES (biomechanics-based) ────────────────────────────────
ANGLE_RANGES = {
    "bicep": {
        "left_elbow":         (30,  160), # full ROM: 30° (contracted) to 160° (extended)
        "right_elbow":        (30,  160),
        "left_shoulder_swing":(160, 180), # shoulder must stay stationary
    },
    "squat": {
        "left_knee":   (70,  170), # parallel squat ≈ 90°, standing ≈ 170°
        "right_knee":  (70,  170),
        "torso_lean":  (60,  100), # slight forward lean acceptable
    },
    "pushup": {
        "left_elbow":       (70,  180), # 70°=bottom of rep, 180°=top
        "body_alignment":   (160, 200), # body should be straight
    },
    "plank": {
        "body_alignment":   (160, 200), # perfectly straight
    },
}

def evaluate_angles(angles: dict, exercise: str) -> list[dict]:
    """Returns list of errors found."""
    errors = []
    ranges = ANGLE_RANGES.get(exercise, {})
    
    for joint, angle_val in angles.items():
        if joint not in ranges: continue
        lo, hi = ranges[joint]
        if not (lo <= angle_val <= hi):
            errors.append({
                "joint":   joint,
                "angle":   round(angle_val, 1),
                "range":   [lo, hi],
                "message": _error_message(joint, angle_val, lo, hi)
            })
    return errors

def _error_message(joint: str, val: float, lo: float, hi: float) -> str:
    messages = {
        "left_elbow":         "Extend your arm fully at the top of the movement" if val > hi else "Curl your arm higher",
        "body_alignment":     "Hips too high — lower them to keep body straight" if val > hi else "Hips sagging — engage your core",
        "left_knee":          "Squat deeper — aim for parallel" if val > hi else "Knees going too far forward",
        "left_shoulder_swing":"Shoulder swinging — keep upper arm still",
        "torso_lean":         "Too much forward lean — keep chest up",
    }
    return messages.get(joint, f"Angle {val:.0f}° out of range [{lo}–{hi}]")

def compute_score(errors: list, total_joints: int) -> float:
    """Score 0–100. Deduct points per error."""
    deduction_per_error = 100.0 / max(total_joints, 1)
    score = 100.0 - (len(errors) * deduction_per_error)
    return max(0.0, round(score, 1))