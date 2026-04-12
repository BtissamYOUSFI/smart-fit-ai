package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.Exercise;
import fit.smart.smartfitapi.service.facade.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise/")
public class ExerciseController {

    @GetMapping("")
    public ResponseEntity<List<Exercise>> findAll() {
        List<Exercise> exercises = service.findAll();
        return new ResponseEntity<>(exercises, HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<Exercise> findById(@PathVariable Long id) {
        Exercise byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(byId, httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<Exercise> save(@RequestBody Exercise exercise) {
        Exercise saved = service.save(exercise);
        HttpStatus httpStatus;
        if (saved == null) {
            httpStatus = HttpStatus.CONFLICT;
        } else {
            httpStatus = HttpStatus.CREATED;
        }
        return new ResponseEntity<>(saved, httpStatus);
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
}
