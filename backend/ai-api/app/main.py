from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routers import upload, websocket, health
from app.pipeline import AnalysisPipeline

pipeline: AnalysisPipeline | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline
    pipeline = AnalysisPipeline()
    app.state.pipeline = pipeline
    print("✅ AI pipeline loaded")
    yield
    pipeline.mp.close()

app = FastAPI(title="SmartFit AI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"])

app.include_router(health.router)
app.include_router(upload.router, prefix="/analyze")
app.include_router(websocket.router)
