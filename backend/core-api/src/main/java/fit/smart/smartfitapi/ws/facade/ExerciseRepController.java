package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.*;
import fit.smart.smartfitapi.repository.AnalysisResultRepository;
import fit.smart.smartfitapi.repository.ExerciseRepository;
import fit.smart.smartfitapi.repository.VideoCaptureRepository;
import fit.smart.smartfitapi.service.facade.ExerciseRepService;
import fit.smart.smartfitapi.util.enums.CaptureMode;
import fit.smart.smartfitapi.ws.converter.ExerciseRepConverter;
import fit.smart.smartfitapi.ws.dto.ExerciseRepDto;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercise-rep/")
public class ExerciseRepController {

    private final ExerciseRepService repService;
    private final ExerciseRepConverter repConverter;
    private final AnalysisResultRepository analysisResultRepo;
    private final VideoCaptureRepository videoCaptureRepo;
    private final ExerciseRepository exerciseRepo;
    private final RestTemplate restTemplate;
    private final String aiApiUrl;

    public ExerciseRepController(
            ExerciseRepService repService,
            ExerciseRepConverter repConverter,
            AnalysisResultRepository analysisResultRepo,
            VideoCaptureRepository videoCaptureRepo,
            ExerciseRepository exerciseRepo,
            RestTemplate restTemplate,
            @Value("${AI_API_URL}") String aiApiUrl) {
        this.repService = repService;
        this.repConverter = repConverter;
        this.analysisResultRepo = analysisResultRepo;
        this.videoCaptureRepo = videoCaptureRepo;
        this.exerciseRepo = exerciseRepo;
        this.restTemplate = restTemplate;
        this.aiApiUrl = aiApiUrl;
    }

    @GetMapping("exercise/{exerciseId}")
    @Operation(summary = "Find reps by exercise", description = "Retrieves all exercise reps associated with a given exercise ID.")
    public ResponseEntity<List<ExerciseRepDto>> findByExercise(@PathVariable Long exerciseId) {
        return ResponseEntity.ok(repConverter.toDtos(repService.findByExerciseId(exerciseId)));
    }

    @GetMapping("id/{id}")
    @Operation(summary = "Find rep by ID", description = "Retrieves an exercise rep using its unique identifier.")
    public ResponseEntity<ExerciseRepDto> findById(@PathVariable Long id) {
        ExerciseRep rep = repService.findById(id);
        if (rep == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(repConverter.toDto(rep));
    }

    @PostMapping("")
    @Operation(summary = "Create a new exercise rep", description = "Saves a new exercise rep and returns it with a created status.")
    public ResponseEntity<ExerciseRepDto> save(@RequestBody ExerciseRepDto dto) {
        ExerciseRep saved = repService.save(repConverter.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(repConverter.toDto(saved));
    }

    @DeleteMapping("id/{id}")
    @Operation(summary = "Delete exercise rep by ID", description = "Deletes an exercise rep using its unique identifier.")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        int i = repService.deleteById(id);
        return i > 0 ? ResponseEntity.ok(i) : ResponseEntity.notFound().build();
    }

    /**
     * POST /api/exercise-rep/id/{repId}/analyze
     * Accepts multipart/form-data with field "file" (video).
     * Forwards to https://soufianebenseddiq-smartfit-ai-api.hf.space/analyze/video,
     * persists VideoCapture + AnalysisResult, recomputes exercise score.
     */
    @PostMapping(value = "id/{repId}/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Analyze a rep video", description = "Accepts a video file, forwards it to the AI service for analysis, persists the video capture and analysis result, and recomputes the exercise score.")
    public ResponseEntity<?> analyzeRep(
            @PathVariable Long repId,
            @RequestParam("file") MultipartFile file) throws IOException {

        ExerciseRep rep = repService.findById(repId);
        if (rep == null) return ResponseEntity.notFound().build();

        // 1 — forward the video to the Hugging Face AI service
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        byte[] bytes = file.getBytes();
        ByteArrayResource resource = new ByteArrayResource(bytes) {
            @Override public String getFilename() { return file.getOriginalFilename(); }
        };
        body.add("file", resource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> aiResponse = restTemplate.exchange(
                aiApiUrl + "/analyze/video",
                HttpMethod.POST, request, Map.class);

        if (!aiResponse.getStatusCode().is2xxSuccessful() || aiResponse.getBody() == null) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("AI service unavailable");
        }
        Map<?, ?> ai = aiResponse.getBody();

        // 2 — persist VideoCapture
        VideoCapture vc = VideoCapture.builder()
                .sourceMode(CaptureMode.UPLOAD)
                .filePath(file.getOriginalFilename())
                .exerciseRep(rep)
                .build();
        videoCaptureRepo.save(vc);
        rep.setVideoCapture(vc);

        // 3 — map AI response → AnalysisResult
        AnalysisResult result = new AnalysisResult();
        result.setExerciseRep(rep);
        result.setGlobalScore(toDouble(ai.get("global_score")));
        result.setExerciseName(String.valueOf(ai.get("exercise")));
        result.setFramesAnalyzed(toInt(ai.get("frames_analyzed")));

        List<AnalysisError> errors = new ArrayList<>();
        if (ai.get("errors") instanceof List<?> errorList) {
            for (Object item : errorList) {
                if (item instanceof Map<?, ?> err) {
                    List<?> range = err.get("range") instanceof List<?> r ? r : List.of(0, 0);
                    errors.add(AnalysisError.builder()
                            .joint(String.valueOf(err.get("joint")))
                            .occurrences(toInt(err.get("occurrences")))
                            .avgAngle(toDouble(err.get("avg_angle")))
                            .worstAngle(toDouble(err.get("worst_angle")))
                            .rangeMin(range.size() > 0 ? toInt(range.get(0)) : null)
                            .rangeMax(range.size() > 1 ? toInt(range.get(1)) : null)
                            .message(String.valueOf(err.get("message")))
                            .build());
                }
            }
        }
        result.setErrors(errors);

        List<String> feedback = new ArrayList<>();
        if (ai.get("feedback") instanceof List<?> fbList) {
            for (Object f : fbList) feedback.add(String.valueOf(f));
        }
        result.setFeedback(feedback);

        analysisResultRepo.save(result);
        rep.setAnalysisResult(result);
        repService.save(rep);

        // 4 — recompute exercise-level score (avg of all analyzed reps)
        exerciseRepo.findById(rep.getExercise().getId()).ifPresent(ex -> {
            ex.computeScore();
            exerciseRepo.save(ex);
        });

        return ResponseEntity.ok(repConverter.toDto(rep));
    }

    private Double toDouble(Object val) {
        return val instanceof Number n ? n.doubleValue() : null;
    }

    private Integer toInt(Object val) {
        return val instanceof Number n ? n.intValue() : null;
    }
}
