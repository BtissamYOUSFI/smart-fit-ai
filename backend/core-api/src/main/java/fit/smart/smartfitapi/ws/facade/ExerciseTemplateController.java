package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.ExerciseTemplate;
import fit.smart.smartfitapi.service.facade.ExerciseTemplateService;
import fit.smart.smartfitapi.ws.converter.ExerciseTemplateConverter;
import fit.smart.smartfitapi.ws.dto.ExerciseTemplateDto;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise-template/")
public class ExerciseTemplateController {

    @GetMapping("")
    @Operation(summary = "Get all exercise templates", description = "Retrieves the complete list of all exercise templates.")
    public ResponseEntity<List<ExerciseTemplateDto>> findAll() {
        List<ExerciseTemplate> exerciseTemplates = service.findAll();
        return new ResponseEntity<>(converter.toDtos(exerciseTemplates), HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    @Operation(summary = "Find exercise template by ID", description = "Retrieves an exercise template using its unique identifier.")
    public ResponseEntity<ExerciseTemplateDto> findById(@PathVariable Long id) {
        ExerciseTemplate byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(converter.toDto(byId), httpStatus);
    }

    @PostMapping("")
    @Operation(summary = "Create a new exercise template", description = "Saves a new exercise template. Returns a conflict status if it already exists.")
    public ResponseEntity<ExerciseTemplateDto> save(@RequestBody ExerciseTemplateDto exerciseTemplateDto) {
        ExerciseTemplate saved = service.save(converter.toEntity(exerciseTemplateDto));
        HttpStatus httpStatus;
        if (saved == null) {
            httpStatus = HttpStatus.CONFLICT;
        } else {
            httpStatus = HttpStatus.CREATED;
        }
        return new ResponseEntity<>(converter.toDto(saved), httpStatus);
    }

    @DeleteMapping("id/{id}")
    @Operation(summary = "Delete exercise template by ID", description = "Deletes an exercise template using its unique identifier.")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        int i = service.deleteById(id);
        HttpStatus httpStatus;
        if (i > 0) {
            httpStatus = HttpStatus.OK;
        } else {
            httpStatus = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(i, httpStatus);
    }

    @Autowired
    private ExerciseTemplateService service;

    @Autowired
    private ExerciseTemplateConverter converter;
}