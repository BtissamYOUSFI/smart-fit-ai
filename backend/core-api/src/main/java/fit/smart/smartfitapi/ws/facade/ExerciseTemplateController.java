package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.ExerciseTemplate;
import fit.smart.smartfitapi.service.facade.ExerciseTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise-template/")
public class ExerciseTemplateController {

    @GetMapping("")
    public ResponseEntity<List<ExerciseTemplate>> findAll() {
        List<ExerciseTemplate> exerciseTemplates = service.findAll();
        return new ResponseEntity<>(exerciseTemplates, HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<ExerciseTemplate> findById(@PathVariable Long id) {
        ExerciseTemplate byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(byId, httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<ExerciseTemplate> save(@RequestBody ExerciseTemplate exerciseTemplate) {
        ExerciseTemplate saved = service.save(exerciseTemplate);
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
    private ExerciseTemplateService service;
}
