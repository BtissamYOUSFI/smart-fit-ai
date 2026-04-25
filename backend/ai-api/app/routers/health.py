from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/health")
def health(request: Request):
    pipeline = request.app.state.pipeline
    return {
        "status": "ok",
        "pipeline_loaded": pipeline is not None
    }
