# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**smart-fit-ai** is a fitness tracking app with AI-assisted exercise analysis. It consists of:
- `backend/core-api/` — Spring Boot REST API (Java 17)
- `frontend/` — React Native mobile app (Expo)
- `infrastructure/` — Docker Compose + Traefik + Prometheus configs

## Commands

### Backend (`backend/core-api/`)

```bash
./mvnw spring-boot:run          # Run locally (requires .env with DB + JWT vars)
./mvnw clean package -DskipTests # Build JAR
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
```

Requires a `.env` file (loaded via `spring-dotenv`) with:
`MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION`, `AI_API_URL`

### Frontend (`frontend/`)

```bash
npm start           # Start Expo dev server
npm run android     # Run on Android emulator
npm run ios         # Run on iOS simulator
npm run web         # Run in browser
npm run lint        # ESLint via expo lint
```

The API URL is configured in `constants/config.ts`. For local dev, uncomment the `localhost` or `LOCAL_IP` variants and comment out the public IP.

### Infrastructure

```bash
# From infrastructure/docker/
docker compose up                           # Start local stack (Traefik + MySQL + core-api + frontend + Prometheus)
docker compose -f docker-compose.prod.yml up -d  # Production
```

## Architecture

### Backend Layer Structure

Every domain entity follows this vertical slice:

```
entity/          ← JPA entity (Lombok: @Builder, @Getter, @Setter)
repository/      ← Spring Data JPA interfaces
service/facade/  ← Service interface
service/impl/    ← Service implementation
ws/dto/          ← Request/response DTOs
ws/converter/    ← Entity ↔ DTO conversion
ws/facade/       ← @RestController (mapped under /api/)
```

### Domain Model

```
User
└── TrainingProgram
    ├── WeeklyTemplate (RepeatMode: ALL_WEEKS | BY_WEEK_OF_MONTH | INDEPENDENT)
    │   └── SessionTemplate
    │       └── ExerciseTemplate
    └── ProgramWeek  (references WeeklyTemplate; isCustomized flag)
        └── Session  (DayOfWeek + scheduledDate + SessionStatus + globalScore)
            └── Exercise  (ExerciseType: SQUAT | PUSHUP | LUNGE | PLANK)
                ├── VideoCapture  (CaptureMode: UPLOAD | LIVE_CAMERA; filePath)
                └── AnalysisResult  (knee/hip/back angles, stability, amplitude, detectedErrors[])
```

**Scoring chain** (all computed in entity methods, not the service layer):

- `AnalysisResult.getGlobalScore()` = avg(knee+hip+back) × 0.5 + stability × 0.25 + amplitude × 0.25
- `Session.calculateGlobalScore()` = avg of `Exercise.score` (must be called explicitly to persist)
- `TrainingProgram.getGlobalScore()` = avg of all session scores across all `ProgramWeek`s
- `TrainingProgram.getCompletionRate()` = completed sessions / total sessions × 100

### API Endpoints

All endpoints require `Authorization: Bearer <token>` except `/api/auth/**`.

| Resource | Base path |
| --- | --- |
| Auth | `/api/auth/` — `POST login`, `POST register` (both return `{token}`) |
| User | `/api/user/` — `GET me`, `GET all`, `GET email/{email}`, `POST add-one`, `PUT update`, `DELETE email/{email}` |
| Training Program | `/api/training-program/` — `GET all`, `GET id/{id}`, `GET title/{title}`, `GET start-date/{s}/end-date/{e}`, `POST add-one`, `PUT update`, `DELETE id/{id}` |
| Program Week | `/api/program-week/` |
| Weekly Template | `/api/weekly-template/` |
| Session | `/api/session/` — `GET ""`, `GET id/{id}`, `POST ""`, `DELETE id/{id}` |
| Session Template | `/api/session-template/` |
| Exercise | `/api/exercise/` |
| Exercise Template | `/api/exercise-template/` |
| Video Capture | `/api/video-capture/` — `GET ""`, `GET id/{id}`, `POST ""`, `DELETE id/{id}` |
| Analysis Result | `/api/analysis-result/` |

`AI_API_URL` is injected as an env var into `core-api` via docker-compose and points to the AI microservice described below.

## AI Microservice (`smartfit-ai-api`)

A separate Python FastAPI service hosted on **Hugging Face Spaces** at `https://soufianebenseddiq-smartfit-ai-api.hf.space`. Source lives in a sibling repo `smartfit-ai-api/`. Deployed automatically via GitHub Actions on push to `main` (rsync + git push to HF Space). Models stored in Git LFS.

### Inference Pipeline (per frame)

1. **YOLO** (`best.pt` — custom YOLOv8) — classifies the exercise from the frame: `bicep | squat | pushup | plank`
2. **LSTM** (`lstm_best.tflite`) — disambiguates pushup vs plank using a 30-frame sliding window of 8 keypoint (x,y) pairs (shoulders, elbows, wrists, hips); outputs probability > 0.5 → plank, else pushup
3. **MediaPipe** — extracts precise 3D pose landmarks from the frame
4. **Angle calculator** — computes exercise-specific joint angles from landmarks
5. **Evaluator** — compares angles to biomechanics reference ranges (with 2° tolerance buffer), produces per-joint error list
6. **Scorer** — `score = 100 − (error_count × 100 / total_joints)`

### Joints Analyzed per Exercise

| Exercise | Joints |
| --- | --- |
| squat | left_knee, right_knee, torso_lean |
| pushup | left_elbow, body_alignment |
| plank | body_alignment |
| bicep | left_elbow, right_elbow, left_shoulder_swing |

### Endpoints

- `GET /health` — confirms pipeline is loaded
- `POST /analyze/video` — multipart video upload; runs pipeline on every frame, aggregates per-joint errors (filtered to >3 occurrences), returns `global_score`, `errors[]`, `feedback[]`
- `WS /ws/analyze` — real-time mode; client streams raw JPEG/PNG bytes, server returns per-frame JSON result

### Response → `AnalysisResult` Entity Mapping

The `POST /analyze/video` response fields map directly to the `AnalysisResult` JPA entity in `core-api`:

| API field | Entity field |
| --- | --- |
| `global_score` | used to compute `Exercise.score` |
| `errors[].message` | stored in `detectedErrors` (`@ElementCollection`) |
| `feedback` | `AnalysisResult.feedback` (TEXT) |

The `errors[].avg_angle` values correspond to `avgKneeAngle / avgHipAngle / avgBackAngle` fields on `AnalysisResult`, though the mapping from joint name to entity field will need to be done explicitly when wiring the integration.

### Converter Pattern

Converters are Spring `@Component`s that handle entity↔DTO mapping and resolve relationships. For example, `TrainingProgramConverter.toEntity()` calls `userService.findByEmail(dto.getUserEmail())` to hydrate the `User` FK — DTOs carry email strings, not IDs, for user references. Converters are injected into controllers directly (no MapStruct).

### Known Inconsistencies

- DI style is mixed: some classes use `@AllArgsConstructor` (constructor injection), others use `@Autowired` fields.
- `findAll()` on most resources returns records for all users — no JWT-based user scoping.
- Services return `null` for "not found" or "conflict" instead of throwing. `SessionController` passes `null` into `converter.toDto()` when a session is not found, which can cause NPEs.
- `TrainingProgramServiceImpl.save()` blocks duplicate titles globally, not per-user.

### Security

All routes require JWT except `/api/auth/**`. The `JwtFilter` validates the `Authorization: Bearer <token>` header on every request. Spring Security is stateless (no sessions). Passwords use BCrypt.

### Frontend Routing

File-based routing via Expo Router. Auth screens live under `app/auth/`. Authenticated screens live under `app/(tabs)/`. The `AuthContext` (`app/context/AuthContext.tsx`) manages JWT state and is checked at app startup via `tokenStorage` (backed by `expo-secure-store`).

The `api.ts` service injects the JWT token into every axios request via an interceptor.

### CI/CD

- **Build workflow**: triggers on push to `main`/`develop`; runs `mvn clean package`, then builds and pushes Docker images to Docker Hub.
- **Deploy workflow**: triggers after Build succeeds on `main`; SSHs into EC2, writes `.env` from GitHub secrets, then does `docker compose pull && up`.

### Infrastructure

Traefik routes `/api` → `core-api:8080` and `/` → `frontend:80`. MySQL 8.4 with a named volume for persistence. Prometheus scrapes the Spring Boot actuator endpoint.
