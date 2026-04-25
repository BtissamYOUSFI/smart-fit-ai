from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import numpy as np, cv2, json, asyncio

router = APIRouter()

@router.websocket("/ws/analyze")
async def websocket_analyze(ws: WebSocket):
    await ws.accept()
    pipeline = ws.app.state.pipeline

    try:
        while True:
            frame_bytes = await ws.receive_bytes()

            nparr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                await ws.send_text(json.dumps({"error": "invalid_frame"}))
                continue

            result = await asyncio.get_event_loop().run_in_executor(
                None, pipeline.analyze_frame, frame
            )

            await ws.send_text(json.dumps(result))

    except WebSocketDisconnect:
        pipeline.lstm.reset()
        print("WebSocket client disconnected")
