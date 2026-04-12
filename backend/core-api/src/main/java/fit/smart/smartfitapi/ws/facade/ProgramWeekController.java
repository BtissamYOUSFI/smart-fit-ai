package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.service.facade.ProgramWeekService;
import fit.smart.smartfitapi.ws.converter.ProgramWeekConverter;
import fit.smart.smartfitapi.ws.dto.ProgramWeekDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/program-week/")
public class ProgramWeekController {

    @GetMapping("")
    public ResponseEntity<List<ProgramWeekDto>> findAll() {
        List<ProgramWeek> programWeeks = service.findAll();
        return new ResponseEntity<>(converter.toDtos(programWeeks), HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<ProgramWeekDto> findById(@PathVariable Long id) {
        ProgramWeek byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(converter.toDto(byId), httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<ProgramWeekDto> save(@RequestBody ProgramWeekDto programWeekDto) {
        ProgramWeek saved = service.save(converter.toEntity(programWeekDto));
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
    private ProgramWeekService service;

    @Autowired
    private ProgramWeekConverter converter;
}