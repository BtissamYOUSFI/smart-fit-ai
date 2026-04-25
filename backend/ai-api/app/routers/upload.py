from fastapi import APIRouter, UploadFile, File, HTTPException, Request
import tempfile, shutil, os

router = APIRouter()

@router.post("/video")
async def analyze_video(request: Request, file: UploadFile = File(...)):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video")

    suffix = os.path.splitext(file.filename)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        shutil.copyfileobj(file.file, temp)
        temp_path = temp.name

    try:
        pipeline = request.app.state.pipeline
        result = pipeline.analyze_video(temp_path)
        return result
    finally:
        try:
            os.remove(temp_path)
        except PermissionError:
            pass  # Windows file lock — will be cleaned up later
