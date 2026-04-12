package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.SessionTemplate;
import fit.smart.smartfitapi.service.facade.SessionTemplateService;
import fit.smart.smartfitapi.ws.converter.SessionTemplateConverter;
import fit.smart.smartfitapi.ws.dto.SessionTemplateDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session-template/")
public class SessionTemplateController {

    @GetMapping("")
    public ResponseEntity<List<SessionTemplateDto>> findAll() {
        List<SessionTemplate> templates = service.findAll();
        return new ResponseEntity<>(converter.toDtos(templates), HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<SessionTemplateDto> findById(@PathVariable Long id) {
        SessionTemplate byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(converter.toDto(byId), httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<SessionTemplateDto> save(@RequestBody SessionTemplateDto sessionTemplateDto) {
        SessionTemplate saved = service.save(converter.toEntity(sessionTemplateDto));
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
    private SessionTemplateService service;

    @Autowired
    private SessionTemplateConverter converter;
}
