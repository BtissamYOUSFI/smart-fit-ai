package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.service.facade.ProgramWeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/program-week/")
public class ProgramWeekController {

    @GetMapping("")
    public ResponseEntity<List<ProgramWeek>> findAll() {
        List<ProgramWeek> programWeeks = service.findAll();
        return new ResponseEntity<>(programWeeks, HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<ProgramWeek> findById(@PathVariable Long id) {
        ProgramWeek byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(byId, httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<ProgramWeek> save(@RequestBody ProgramWeek programWeek) {
        ProgramWeek saved = service.save(programWeek);
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
    private ProgramWeekService service;
}
