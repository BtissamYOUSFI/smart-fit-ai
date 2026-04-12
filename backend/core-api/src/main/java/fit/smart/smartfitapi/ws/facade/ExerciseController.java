package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.Exercise;
import fit.smart.smartfitapi.service.facade.ExerciseService;
import fit.smart.smartfitapi.ws.converter.ExerciseConverter;
import fit.smart.smartfitapi.ws.dto.ExerciseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise/")
public class ExerciseController {

    @GetMapping("")
    public ResponseEntity<List<ExerciseDto>> findAll() {
        List<Exercise> exercises = service.findAll();
        return new ResponseEntity<>(converter.toDtos(exercises), HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<ExerciseDto> findById(@PathVariable Long id) {
        Exercise byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(converter.toDto(byId), httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<ExerciseDto> save(@RequestBody ExerciseDto exerciseDto) {
        Exercise saved = service.save(converter.toEntity(exerciseDto));
        HttpStatus httpStatus;
        if (saved == null) {
            httpStatus = HttpStatus.CONFLICT;
        } else {
            httpStatus = HttpStatus.CREATED;
        }
        return new ResponseEntity<>(converter.toDto(saved), httpStatus);
    }

    @DeleteMapping("id/{id}")
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
    private ExerciseService service;

    @Autowired
    private ExerciseConverter converter;
}