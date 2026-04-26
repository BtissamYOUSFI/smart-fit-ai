import cv2
import numpy as np
from fastapi import UploadFile, File, Request, APIRouter

router = APIRouter()

@router.post("/image")
async def upload_image(file: UploadFile = File(...), request: Request = None):
    pipeline = request.app.state.pipeline

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    result = pipeline.analyze_frame(frame)
    return result
